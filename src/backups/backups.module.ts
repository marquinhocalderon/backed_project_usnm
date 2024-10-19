import { Module } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { BackupsController } from './backups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Backups } from './entities/backup.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';
import { DetallebackupsModule } from 'src/detallebackups/detallebackups.module';
import { DetalleBackups } from 'src/detallebackups/entities/detallebackup.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Backups, Gabinentes, Usuario, DetalleBackups]), 
    DetallepermisosModule, 
    DetallebackupsModule, // Cambiado aquí
  ],
  controllers: [BackupsController],
  providers: [BackupsService],
})
export class BackupsModule {}
