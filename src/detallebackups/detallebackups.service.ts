import { Injectable } from '@nestjs/common';
import { CreateDetallebackupDto } from './dto/create-detallebackup.dto';
import { UpdateDetallebackupDto } from './dto/update-detallebackup.dto';
import { Backups } from 'src/backups/entities/backup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetalleBackups } from './entities/detallebackup.entity';

@Injectable()
export class DetallebackupsService {
  constructor(
    @InjectRepository(Backups) private backupsRepositorio: Repository<Backups>,
    @InjectRepository(Gabinentes)
    private gabineteRepositorip: Repository<Gabinentes>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(DetalleBackups)
    private detallebackupsRepositorio: Repository<DetalleBackups>,
  ) {}

  async create(id_backup: any, documentos: any, data: any) {

    console.log(id_backup , data);
    // Verificar si el backup existe
    const backupEncontrado = await this.backupsRepositorio.findOneBy({
      id: Number(id_backup),
    });
  
    if (!backupEncontrado) {
      return { message: 'Backup no encontrado', success: false };
    }
  
    // Verificar si el gabinete existe
    const gabineteEncontrado = await this.gabineteRepositorip.findOneBy({
      id: Number(data.id_gabinete),
    });
  
    if (!gabineteEncontrado) {
      return { message: 'Gabinete no encontrado', success: false };
    }
  
    // Verificar si el usuario existe
    const usuarioEncontrado = await this.usuarioRepositorio.findOneBy({
      id: Number(data.id_usuario),
    });
  
    if (!usuarioEncontrado) {
      return { message: 'Usuario no encontrado', success: false };
    }
  
    // Crear un nuevo detalle del backup
    const nuevoDetalleBackup = this.detallebackupsRepositorio.create({
      backups: backupEncontrado,
      gabinetes: gabineteEncontrado,
      backups_json: documentos,
      fecha: new Date(),
      usuarios: usuarioEncontrado,
    });
  
    // Guardar el detalle del backup
    const response =  this.detallebackupsRepositorio.save(nuevoDetalleBackup);

    console.log(response);

    return {
      message: 'Se creo el backup correctamente',
      success: true,
    };
  }
  

  async verficarSiHayCreadoConeseGabinete(id_gabinete: number) {
    const gabineteEncontrado = await this.gabineteRepositorip.findOneBy({
      id: id_gabinete,
    });

    const detalleBackupEncontrado = await this.detallebackupsRepositorio.findOneBy({
      gabinetes: gabineteEncontrado,
    })

    if (detalleBackupEncontrado) {
      return {
        id_backup : detalleBackupEncontrado.backups.id,
        message: 'Gabinete encontrado',
        success: true,
      };
    } else {
      return {
        message: 'Gabinete no encontrado',
        success: false,
      };
    }
  }

  findAll() {
    return `This action returns all detallebackups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallebackup`;
  }

  update(id: number, updateDetallebackupDto: UpdateDetallebackupDto) {
    return `This action updates a #${id} detallebackup`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallebackup`;
  }
}
