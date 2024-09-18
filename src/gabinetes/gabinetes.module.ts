import { Module } from '@nestjs/common';
import { GabinetesService } from './gabinetes.service';
import { GabinetesController } from './gabinetes.controller';
import { Gabinentes } from './entities/gabinete.entity';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gabinentes, Facultade, Usuario]), DetallepermisosModule],
  controllers: [GabinetesController],
  providers: [GabinetesService],
})
export class GabinetesModule {}
