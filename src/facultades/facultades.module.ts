import { Module } from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { FacultadesController } from './facultades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultade } from './entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Facultade, Usuario]),DetallepermisosModule],
  controllers: [FacultadesController],
  providers: [FacultadesService],
})
export class FacultadesModule {}
