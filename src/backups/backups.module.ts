import { Module } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { BackupsController } from './backups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { Backups } from './entities/backup.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Backups, Gabinentes, Usuario, Facultade])],
  controllers: [BackupsController],
  providers: [BackupsService],
})
export class BackupsModule {}
