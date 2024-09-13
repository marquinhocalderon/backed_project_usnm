import { Module } from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { FacultadesController } from './facultades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultade } from './entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Facultade, Usuario])],
  controllers: [FacultadesController],
  providers: [FacultadesService],
})
export class FacultadesModule {}
