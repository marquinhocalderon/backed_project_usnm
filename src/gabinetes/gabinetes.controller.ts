import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, HttpException, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { GabinetesService } from './gabinetes.service';
import { CreateGabineteDto, SweaggerCreategABINITEDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nombreComoSeGuarda, validarTipodeArchivoGuardar } from 'src/usuarios/helpers/imagenes.helpers';
import * as fs from 'fs';
import * as path from 'path';
import { GabineteDto } from './dto/get-gabinete.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { SweaggerCreateBackupDto } from 'src/backups/dto/create-backup.dto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

@UseGuards(AuthGuard)
@ApiTags('Gabinetes')
@Controller('gabinetes')
export class GabinetesController {
  constructor(private readonly gabinetesService: GabinetesService) {}

  @ApiBody({ type: SweaggerCreategABINITEDto })
  @Post()
  @Permission('create-gabinetes')
@UseInterceptors(FilesInterceptor('imagenes', 10, { 
  storage: diskStorage({
    destination: (req, file, cb) => {
      const tempPath = './temp/uploads/gabinetesimagenes';
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
      }
      cb(null, tempPath);
    },
    filename: nombreComoSeGuarda
  }),
  fileFilter: (req, file, cb) => {
    if (file.size > MAX_SIZE_BYTES) {
      return cb(new BadRequestException(`El tamaño de la imagen ${file.originalname} es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.`), false);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new BadRequestException(`El archivo ${file.originalname} no es una imagen válida. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.`), false);
    }

    cb(null, true);
  },
}))
async create(@UploadedFiles() imagenes: Express.Multer.File[], @Body() createGabinete: CreateGabineteDto) {
  if (imagenes.length === 0) {
    throw new BadRequestException('No se subieron imágenes. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.');
  }

  // Verificar si alguna imagen excede el tamaño permitido antes de guardar
  const imagenGrande = imagenes.find(imagen => imagen.size > MAX_SIZE_BYTES);
  if (imagenGrande) {
    // Eliminar todas las imágenes subidas si alguna excede el tamaño permitido
    imagenes.forEach(imagen => {
      const filePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    throw new BadRequestException(`El tamaño de la imagen ${imagenGrande.originalname} es demasiado grande. Por favor, proporciona imágenes de menos de 1 MB.`);
  }

  const nombresArchivos = imagenes.map(imagen => imagen.filename);
  

  // Procesar la lógica del servicio
  const resultado = await this.gabinetesService.create(createGabinete, nombresArchivos);
  // Si el servicio retorna un estado 200, mover las imágenes a la carpeta final
  if (resultado.success) {
    const finalPath = './uploads/gabinetesimagenes';
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    imagenes.forEach(imagen => {
      const tempFilePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
      const finalFilePath = path.join(finalPath, imagen.filename);
      fs.renameSync(tempFilePath, finalFilePath);
    });

    return { message: 'Se registró correctamente' };
  } else {
    // Eliminar todas las imágenes temporales si hay un error
    imagenes.forEach(imagen => {
      const filePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    throw new HttpException(`Error al registrar el gabinete, ${resultado.message} `, HttpStatus.BAD_REQUEST);
  }
}




  @ApiBody({ type: [GabineteDto] })
  @Get()
  @Permission('read-gabinetes')
  findAll() {
    return this.gabinetesService.findAll();
  }

  @ApiBody({ type: [GabineteDto] })
  @Get(':id')
  @Permission('read-gabinetes')
  findOne(@Param('id') id: string) {
    return this.gabinetesService.findOne(+id);
  }

  @ApiBody({ type: UpdateGabineteDto }) // Asegúrate de que SwaggerCreateGabineteDto sea correcto
  @Patch() // Cambiado a PUT
  @Permission('update-gabinetes')
  @UseInterceptors(FilesInterceptor('imagenes', 10, { 
    storage: diskStorage({
      destination: (req, file, cb) => {
        const tempPath = './temp/uploads/gabinetesimagenes';
        if (!fs.existsSync(tempPath)) {
          fs.mkdirSync(tempPath, { recursive: true });
        }
        cb(null, tempPath);
      },
      filename: nombreComoSeGuarda
    }),
    fileFilter: (req, file, cb) => {
      if (file.size > MAX_SIZE_BYTES) {
        return cb(new BadRequestException(`El tamaño de la imagen ${file.originalname} es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.`), false);
      }
  
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new BadRequestException(`El archivo ${file.originalname} no es una imagen válida. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.`), false);
      }
  
      cb(null, true);
    },
  }))
  async update(
    @UploadedFiles() imagenes: Express.Multer.File[] = [], // Las imágenes son opcionales
    @Body() updateGabinete: UpdateGabineteDto // Asegúrate de que UpdateGabineteDto esté importado y definido correctamente
  ) {
    // Procesar la lógica del servicio, siempre pasando el arreglo de imágenes
    const resultado = await this.gabinetesService.update(updateGabinete, imagenes); // Pasar el arreglo de imágenes (vacío o lleno)
  
    // Si hay imágenes, verificar si alguna excede el tamaño permitido
    const imagenGrande = imagenes.find(imagen => imagen.size > MAX_SIZE_BYTES);
    if (imagenGrande) {
      // Eliminar todas las imágenes subidas si alguna excede el tamaño permitido
      imagenes.forEach(imagen => {
        const filePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new BadRequestException(`El tamaño de la imagen ${imagenGrande.originalname} es demasiado grande. Por favor, proporciona imágenes de menos de 1 MB.`);
    }
  
    // Si el servicio retorna un estado 200, mover las imágenes a la carpeta final
    if (resultado.success) {
      const finalPath = './uploads/gabinetesimagenes';
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }
  
      imagenes.forEach(imagen => {
        if (imagen) { // Asegúrate de que la imagen no sea undefined
          const tempFilePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
          const finalFilePath = path.join(finalPath, imagen.filename);
          fs.renameSync(tempFilePath, finalFilePath);
        }
      });
  
      return { message: 'Se actualizó correctamente con imágenes.' };
    } else {
      // Eliminar todas las imágenes temporales si hay un error
      imagenes.forEach(imagen => {
        const filePath = path.join('./temp/uploads/gabinetesimagenes', imagen.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new HttpException(`Error al actualizar el gabinete, ${resultado.message}`, HttpStatus.BAD_REQUEST);
    }
  }
  

  @Delete(':id')
  @Permission('delete-gabinetes')
  remove(@Param('id') id: string) {
    return this.gabinetesService.remove(+id);
  }
}
