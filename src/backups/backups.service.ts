import { Injectable } from '@nestjs/common';
import { CreateBackupDto } from './dto/create-backup.dto';
import { UpdateBackupDto } from './dto/update-backup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Repository } from 'typeorm';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Backups } from './entities/backup.entity';
import { BackupDto } from './dto/get-backup.dto';
import { DetallebackupsService } from 'src/detallebackups/detallebackups.service';

@Injectable()
export class BackupsService {
  constructor(
    @InjectRepository(Backups) private backupsRepositorio: Repository<Backups>,
    @InjectRepository(Gabinentes)
    private gabineteRepositorip: Repository<Gabinentes>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
    private readonly detallebackups: DetallebackupsService,
  ) {}

  async create(createBackupDto: CreateBackupDto, files: any) {
    // Convertir los archivos a formato JSON
    const documentos = files.map((file) => ({ documento: file }));
  
    const id_gabinete = Number(createBackupDto.id_gabinete);
  
    // Verificar si ya existe un backup con ese gabinete
    const respuesta = await this.detallebackups.verficarSiHayCreadoConeseGabinete(id_gabinete);

    if (respuesta.success === false) {
      // Crear un nuevo backup
      const nuevoBackup = this.backupsRepositorio.create({
        estado: true, // Definir el estado inicial del backup
      });
  
      // Guardar el nuevo backup en la base de datos
      const backupGuardado = await this.backupsRepositorio.save(nuevoBackup);

      console.log(backupGuardado.id);
  
      const repuesta2 = await this.detallebackups.create(backupGuardado.id, documentos, createBackupDto);

      console.log(repuesta2);

      if (!repuesta2.success) {
        await this.backupsRepositorio.delete(backupGuardado.id);
        return repuesta2;
      }
      else{
        return repuesta2
      }
    }


  
    // Si ya existe el backup, enviar un id_datos_recogido vacío
    return this.detallebackups.create(respuesta.id_backup, documentos, createBackupDto);
  }
  
  findAll() {
    return `This action returns all backups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backup`;
  }

  update(id: number, updateBackupDto: UpdateBackupDto) {
    return `This action updates a #${id} backup`;
  }

  remove(id: number) {
    return `This action removes a #${id} backup`;
  }
}
