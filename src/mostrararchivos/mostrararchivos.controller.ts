import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res } from '@nestjs/common';
import { MostrararchivosService } from './mostrararchivos.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Archivos Medias')
@Controller('file')
export class MostrararchivosController {
  constructor(private readonly mostrararchivosService: MostrararchivosService) {}
  @Get('imagen/:url_imagen')
  getImagen(@Param('url_imagen') filename: string, @Res() res: Response) {

    // Construye la ruta completa del archivo usando el directorio actual de trabajo
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'gabinetesimagenes', filename);

    // Verifica si el archivo existe
    if (fs.existsSync(filePath)) {
      // Envía el archivo al cliente
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error al enviar el archivo:', err);
          throw new HttpException('Error al enviar la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
    } else {
      // Lanza una excepción si el archivo no se encuentra
      throw new HttpException('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }
  }

  @Get('txt/:filename')
  getTxtFile(@Param('filename') filename: string, @Res() res: Response) {
    console.log(filename);
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'backups', filename); // No es necesario agregar `.txt` aquí
  
    console.log(filePath);
  
    if (fs.existsSync(filePath)) {
      // Establecer encabezados para indicar que es un archivo descargable
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${filename}"`, // Establecer el nombre del archivo para la descarga
      });
  
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Error al enviar el archivo:', err);
          throw new HttpException('Error al enviar el archivo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
    } else {
      throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
    }
  }
  

}