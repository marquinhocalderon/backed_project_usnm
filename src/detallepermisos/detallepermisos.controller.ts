import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetallepermisosService } from './detallepermisos.service';
import { CreateDetallepermisoDto } from './dto/create-detallepermiso.dto';
import { UpdateDetallepermisoDto, UpdatePeticiones } from './dto/update-detallepermiso.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MainDto, UsuarioDto2 } from './dto/get-usuarios-permisos.dto';



@UseGuards(AuthGuard)
@Controller('peticion')
export class DetallepermisosController {
  constructor(private readonly detallepermisosService: DetallepermisosService) {}

  // @Post()
  // create(@Body() createDetallepermisoDto: any) {
  //   return this.detallepermisosService.create();
  // }
  @ApiBody({ type: UsuarioDto2 })
  @ApiTags('Usuarios')
  @Get('/usuarios/all')
  @Permission('read-usuarios')
  findAll() {
    return this.detallepermisosService.findAll();
  }
  @ApiBody({ type: MainDto })
  @ApiTags('Usuarios')
  @Get('usuarios/:id_usuario')
  @Permission('read-usuarios')
  findOne(@Param('id_usuario') id: string) {
    return this.detallepermisosService.findOne(+id);
  }

  @ApiTags('DetallePermisos')
  @ApiBody({ type: [UpdateDetallepermisoDto] })
  @Patch('modulospermisos/:id_usuario')
  @Permission('update-detallepermisos')
  update(@Param('id_usuario') id: string, @Body() updateDetallepermisoDtos: UpdateDetallepermisoDto[]) {
    return this.detallepermisosService.update(+id, updateDetallepermisoDtos);
  }

  @ApiTags('DetallePermisos')
  @ApiBody({ type: [UpdatePeticiones] })
  @Patch('submodulospermisos/:id_usuario')
  @Permission('update-detallepermisos')
  updatePeticiones(@Param('id_usuario') id: string, @Body() updatePeticiones: UpdatePeticiones[]) {
    return this.detallepermisosService.updatePeticiones(+id, updatePeticiones);
  }
  



  

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.detallepermisosService.remove(+id);
  // }
}
