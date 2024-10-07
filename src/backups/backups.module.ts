import { Module } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { BackupsController } from './backups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Backups } from './entities/backup.entity';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';


@Module({
  imports : [TypeOrmModule.forFeature([Backups, Gabinentes, Usuario]), DetallepermisosModule],
  controllers: [BackupsController],
  providers: [BackupsService],
})
export class BackupsModule {}
