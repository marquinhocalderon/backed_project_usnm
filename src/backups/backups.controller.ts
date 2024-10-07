import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nombreComoSeGuarda, validarTipodeArchivoGuardar } from 'src/usuarios/helpers/imagenes.helpers';
import * as fs from 'fs';
import * as path from 'path';
import { BackupsService } from './backups.service';
import { UpdateBackupDto } from './dto/update-backup.dto';
import { CreateBackupDto } from './dto/create-backup.dto';
const ALLOWED_MIME_TYPES = ['text/plain']; // Solo texto plano
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

@Controller('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('archivos', 3, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const tempPath = './temp/uploads/backups';
        if (!fs.existsSync(tempPath)) {
          fs.mkdirSync(tempPath, { recursive: true });
        }
        cb(null, tempPath);
      },
      filename: nombreComoSeGuarda,
    }),
    fileFilter: (req, file, cb) => {
      // Validar el tamaño del archivo
      if (file.size > MAX_SIZE_BYTES) {
        return cb(
          new BadRequestException(`El tamaño del archivo ${file.originalname} es demasiado grande. Por favor, proporciona un archivo de texto de menos de 10 MB.`),
          false,
        );
      }

      // Validar el tipo de archivo
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
          new BadRequestException(`El archivo ${file.originalname} no es un archivo de texto válido. Por favor, proporciona archivos en formato .txt.`),
          false,
        );
      }

      cb(null, true);
    },
  }))
  async create(@UploadedFiles() archivos: Express.Multer.File[], @Body() createBackupDto: CreateBackupDto) {
    
    // Verificar que se subieron archivos
    if (!archivos || archivos.length === 0) {
      throw new BadRequestException('No se subieron archivos. Por favor, proporciona archivos de texto en formato .txt.');
    }

    // Verificar si alguno de los archivos excede el tamaño permitido antes de guardar
    const archivoGrande = archivos.find(archivo => archivo.size > MAX_SIZE_BYTES);
    if (archivoGrande) {
      // Eliminar todos los archivos subidos si alguno excede el tamaño permitido
      archivos.forEach(archivo => {
        const filePath = path.join('./temp/uploads/backups', archivo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new BadRequestException(`El tamaño del archivo ${archivoGrande.originalname} es demasiado grande. Por favor, proporciona archivos de texto de menos de 10 MB.`);
    }

    const nombresArchivos = archivos.map(archivo => archivo.filename);

    // Procesar la lógica del servicio
    const resultado = await this.backupsService.create(createBackupDto, nombresArchivos);

    // Si el servicio retorna un estado 200, mover los archivos a la carpeta final
    if (resultado.success) {
      const finalPath = './uploads/backups';
      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }

      archivos.forEach(archivo => {
        const tempFilePath = path.join('./temp/uploads/backups', archivo.filename);
        const finalFilePath = path.join(finalPath, archivo.filename);
        fs.renameSync(tempFilePath, finalFilePath);
      });

      return { message: 'Se registró correctamente' };
    } else {
      // Eliminar todos los archivos temporales si hay un error
      archivos.forEach(archivo => {
        const filePath = path.join('./temp/uploads/backups', archivo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      throw new HttpException(`Error al registrar el backup, ${resultado.message}`, HttpStatus.BAD_REQUEST);
    }
  }
  
  @Get()
  findAll() {
    return this.backupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBackupDto: UpdateBackupDto) {
    return this.backupsService.update(+id, updateBackupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backupsService.remove(+id);
  }
}
