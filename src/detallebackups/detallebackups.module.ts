import { Module } from '@nestjs/common';
import { DetallebackupsService } from './detallebackups.service';
import { DetallebackupsController } from './detallebackups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleBackups } from './entities/detallebackup.entity';
import { Backups } from 'src/backups/entities/backup.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';

@Module({
  imports : [TypeOrmModule.forFeature([Backups, DetalleBackups]), DetallepermisosModule],
  controllers: [DetallebackupsController],
  providers: [DetallebackupsService],
})
export class DetallebackupsModule {}
