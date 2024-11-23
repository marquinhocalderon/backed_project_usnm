import { Module } from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { FacultadesController } from './facultades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultade } from './entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Facultade, Usuario, Gabinentes]),DetallepermisosModule],
  controllers: [FacultadesController],
  providers: [FacultadesService],
})
export class FacultadesModule {}
