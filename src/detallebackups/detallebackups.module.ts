import { Module } from '@nestjs/common';
import { DetallebackupsService } from './detallebackups.service';
import { DetallebackupsController } from './detallebackups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleBackups } from './entities/detallebackup.entity';
import { Backups } from 'src/backups/entities/backup.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Backups, DetalleBackups,  Gabinentes, Usuario]), DetallepermisosModule],
  controllers: [DetallebackupsController],
  providers: [DetallebackupsService],
})
export class DetallebackupsModule {}
