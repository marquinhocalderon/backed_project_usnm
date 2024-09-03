import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto
} from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  nombreComoSeGuarda,
  validarTipodeArchivoGuardar,
} from './helpers/imagenes.helpers';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetPerfilDto } from 'src/perfiles/dto/get-perfile.dto';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';

@ApiTags("Usuarios")
@UseGuards(AuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  //   @ApiBody({ type: MostrarSwaggerCreateUsuarioDto })
  //   @Post()
  //   @UseInterceptors(FileInterceptor('imagen', {
  //     storage: diskStorage({
  //       destination: './uploads/usuarios',
  //       filename: nombreComoSeGuarda
  //     }),
  //     fileFilter: validarTipodeArchivoGuardar,
  //   }))
  //   create(@UploadedFile() imagen:Express.Multer.File , @Body() createUsuarioDto: CreateUsuarioDto) {
  //     if (imagen) {
  //       const MAX_SIZE_MB = 10; // Tamaño máximo en MB
  //       const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convertir MB a bytes

  //       if (imagen.size > MAX_SIZE_BYTES) {
  //         throw new BadRequestException('El tamaño de la imagen es demasiado grande. Por favor, proporciona una imagen de menos de 10 MB.');
  //       }
  //     } else {
  //       throw new BadRequestException('Imagen no subida. Por favor, proporciona una imagen en formato JPG, JPEG, PNG o GIF.');
  //     }

  //  // Pasa el DTO y el nombre del archivo al servicio
  //     return this.usuariosService.create(createUsuarioDto, imagen.filename);
  //   }

  @ApiBody({ type: CreateUsuarioDto })
  @Permission('create-usuarios')
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }
  
  // @ApiBody({ type: [GetUsuarioDto] })
  // @Permission('read-usuarios')
  // @Get()
  // findAll() {
  //   return this.usuariosService.findAll();
  // }

  // @ApiBody({ type: [GetUsuarioDto] })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usuariosService.findOne(+id);
  // }

  @ApiBody({ type: [UpdateUsuarioDto] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
