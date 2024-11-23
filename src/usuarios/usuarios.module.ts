import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Perfile } from '../perfiles/entities/perfile.entity';
import { DetallepermisosModule } from '../detallepermisos/detallepermisos.module';
import { Detallepermiso } from '../detallepermisos/entities/detallepermiso.entity';
import { DetalleBackups } from 'src/detallebackups/entities/detallebackup.entity';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Facultade } from 'src/facultades/entities/facultade.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfile, Detallepermiso, DetalleBackups, Gabinentes, Facultade]), DetallepermisosModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
