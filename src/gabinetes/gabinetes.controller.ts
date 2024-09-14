import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles } from '@nestjs/common';
import { GabinetesService } from './gabinetes.service';
import { CreateGabineteDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';
import { ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nombreComoSeGuarda, validarTipodeArchivoGuardar } from 'src/usuarios/helpers/imagenes.helpers';

@Controller('gabinetes')
export class GabinetesController {
  constructor(private readonly gabinetesService: GabinetesService) {}


  
  @Post()
  @UseInterceptors(FilesInterceptor('imagenes', 10, { // 'imagenes' es el nombre del campo, 10 es el número máximo de archivos
    storage: diskStorage({
      destination: './uploads/gabinetesimagenes',
      filename: nombreComoSeGuarda
    }),
    fileFilter: validarTipodeArchivoGuardar,
  }))
  create(@UploadedFiles() imagenes: Express.Multer.File[], @Body() createGabinete: CreateGabineteDto) {
    const MAX_SIZE_MB = 10; // Tamaño máximo en MB por archivo
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convertir MB a bytes
  
    imagenes.forEach(imagen => {
      if (imagen.size > MAX_SIZE_BYTES) {
        throw new BadRequestException(`El tamaño de la imagen ${imagen.originalname} es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.`);
      }
    });
  
    if (imagenes.length === 0) {
      throw new BadRequestException('No se subieron imágenes. Por favor, proporciona imágenes en formato JPG, JPEG, PNG o GIF.');
    }
  
    // Pasa el DTO y los nombres de los archivos al servicio
    const nombresArchivos = imagenes.map(imagen => imagen.filename);
    return this.gabinetesService.create(createGabinete, nombresArchivos);
  }
  


  @Get()
  findAll() {
    return this.gabinetesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gabinetesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGabineteDto: UpdateGabineteDto) {
    return this.gabinetesService.update(+id, updateGabineteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gabinetesService.remove(+id);
  }
}
