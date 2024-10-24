import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { CreateFacultadeDto } from './dto/create-facultade.dto';
import { UpdateFacultadeDto } from './dto/update-facultade.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nombreComoSeGuarda } from 'src/usuarios/helpers/imagenes.helpers';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
@UseGuards(AuthGuard)
@Controller('facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  @Post()
  @Permission('create-facultades')
  @UseInterceptors(
    FilesInterceptor('imagenes', 1, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const tempPath = './temp/uploads/facultadesimagenes';
          if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true });
          }
          cb(null, tempPath);
        },
        filename: nombreComoSeGuarda,
      }),
      fileFilter: (req, file, cb) => {
        if (file.size > MAX_SIZE_BYTES) {
          return cb(
            new BadRequestException(
              `El tamaño de la imagen ${file.originalname} es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.`,
            ),
            false,
          );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `El archivo ${file.originalname} no es una imagen válida. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.`,
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async create2(
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Body() createGabinete: CreateFacultadeDto,
  ) {
    if (imagenes.length === 0) {
      throw new BadRequestException(
        'No se subieron imágenes. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.',
      );
    }

    // Verificar si alguna imagen excede el tamaño permitido antes de guardar
    const imagenGrande = imagenes.find(
      (imagen) => imagen.size > MAX_SIZE_BYTES,
    );
    if (imagenGrande) {
      // Eliminar todas las imágenes subidas si alguna excede el tamaño permitido
      imagenes.forEach((imagen) => {
        const filePath = path.join(
          './temp/uploads/facultadesimagenes',
          imagen.filename,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new BadRequestException(
        `El tamaño de la imagen ${imagenGrande.originalname} es demasiado grande. Por favor, proporciona imágenes de menos de 1 MB.`,
      );
    }

    const nombresArchivos = imagenes.map((imagen) => imagen.filename);

    // Procesar la lógica del servicio
    const resultado = await this.facultadesService.create(
      createGabinete,
      nombresArchivos,
    );
    // Si el servicio retorna un estado 200, mover las imágenes a la carpeta final
    if (resultado.success) {
      const finalPath = './uploads/facultadesimagenes';
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }

      imagenes.forEach((imagen) => {
        const tempFilePath = path.join(
          './temp/uploads/facultadesimagenes',
          imagen.filename,
        );
        const finalFilePath = path.join(finalPath, imagen.filename);
        fs.renameSync(tempFilePath, finalFilePath);
      });

      return { message: 'Se registró correctamente' };
    } else {
      // Eliminar todas las imágenes temporales si hay un error
      imagenes.forEach((imagen) => {
        const filePath = path.join(
          './temp/uploads/facultadesimagenes',
          imagen.filename,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new HttpException(
        `Error al registrar la facultad, ${resultado.message} `,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Permission('read-facultades')
  findAll() {
    return this.facultadesService.findAll();
  }

  @Get(':id')
  @Permission('read-facultades')
  findOne(@Param('id') id: string) {
    return this.facultadesService.findOne(+id);
  }

  @Patch() // Cambiado a PUT
  @Permission('update-facultades')
  @UseInterceptors(FilesInterceptor('imagenes', 1, { 
    storage: diskStorage({
      destination: (req, file, cb) => {
        const tempPath = './temp/uploads/facultadesimagenes';
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
  async update2(
    @UploadedFiles() imagenes: Express.Multer.File[] = [], // Las imágenes son opcionales
    @Body() updateGabinete: UpdateFacultadeDto // Asegúrate de que UpdateGabineteDto esté importado y definido correctamente2
  ) {
    // Procesar la lógica del servicio, siempre pasando el arreglo de imágenes
    const resultado = await this.facultadesService.update(updateGabinete, imagenes); // Pasar el arreglo de imágenes (vacío o lleno)
  
    

    // Si hay imágenes, verificar si alguna excede el tamaño permitido
    const imagenGrande = imagenes.find(imagen => imagen.size > MAX_SIZE_BYTES);
    if (imagenGrande) {
      // Eliminar todas las imágenes subidas si alguna excede el tamaño permitido
      imagenes.forEach(imagen => {
        const filePath = path.join('./temp/uploads/facultadesimagenes', imagen.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new BadRequestException(`El tamaño de la imagen ${imagenGrande.originalname} es demasiado grande. Por favor, proporciona imágenes de menos de 1 MB.`);
    }
  
    // Si el servicio retorna un estado 200, mover las imágenes a la carpeta final
    if (resultado.success) {
      const finalPath = './uploads/facultadesimagenes';
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }
  
      imagenes.forEach(imagen => {
        if (imagen) { // Asegúrate de que la imagen no sea undefined
          const tempFilePath = path.join('./temp/uploads/facultadesimagenes', imagen.filename);
          const finalFilePath = path.join(finalPath, imagen.filename);
          fs.renameSync(tempFilePath, finalFilePath);
        }
      });
  
      return { message: 'Se actualizó correctamente con imágenes.' };
    } else {
      // Eliminar todas las imágenes temporales si hay un error
      imagenes.forEach(imagen => {
        const filePath = path.join('./temp/uploads/facultadesimagenes', imagen.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new HttpException(`Error al actualizar la facultad, ${resultado.message}`, HttpStatus.BAD_REQUEST);
    }
  }




  @Delete(':id')
  @Permission('delete-facultades')
  remove(@Param('id') id: string) {
    return this.facultadesService.remove(+id);
  }
}
