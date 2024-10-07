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

@Injectable()
export class BackupsService {
  constructor(
    @InjectRepository(Backups) private backupsRepositorio: Repository<Backups>,
    @InjectRepository(Gabinentes)
    private gabineteRepositorip: Repository<Gabinentes>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async create(createBackupDto: CreateBackupDto, files: any) {
    // Asigna las URLs de las imágenes al DTO
    const files1 = files[0] ?? null;
    const files2 = files[1] ?? null;
    const files3 = files[2] ?? null;

    console.log(files1, files2, files3);

    const usuarioEncontrado = await this.usuarioRepositorio.findOneBy({
      id: parseInt(createBackupDto.id_usuario, 10),
    });

    if (usuarioEncontrado === null) {
      return {
        success: false,
        message: 'Usuario No Existe',
      };
    }

    const gabinente = await this.gabineteRepositorip.findOneBy({
      id: parseInt(createBackupDto.id_gabinete, 10),
    });

    if (gabinente === null) {
      return {
        success: false,
        message: 'Gabinete No Existe',
      };
    }

    const nuevodato = this.backupsRepositorio.create({
      backup1: files1,
      backup2: files2,
      backup3: files3,
      usuarios: usuarioEncontrado,
      gabinetes: gabinente,
    });

    await this.backupsRepositorio.save(nuevodato);

    return {
      success: true,
      message: 'Se registro Correctamente',
    };
  }

  async findAll(): Promise<BackupDto[]> {
    try {
      const backups = await this.backupsRepositorio.find();

      return backups.map(backup => this.construirElJson(backup));
    } catch (error) {
      console.error('Error al recuperar los backups:', error);
      throw new Error('No se pudieron recuperar los backups');
    }
  }

  private construirElJson(backup: Backups): BackupDto {
    return {
      id: backup.id,
      archivos: [
        { archivo: backup.backup1 },
        { archivo: backup.backup2 },
        { archivo: backup.backup3 },
      ],
      gabinete: {
        id: backup.gabinetes.id,
        nombre_gabinete: backup.gabinetes.nombre_gabinete,
        descripcion_referencia: backup.gabinetes.descripcion_referencia,
        estado: backup.gabinetes.estado,
      },
      usuario: {
        id: backup.usuarios.id,
        username: backup.usuarios.username,
        nombre_completo: backup.usuarios.nombre_completo,
        estado: backup.usuarios.estado,
        perfiles: {
          id: backup.usuarios.perfiles.id,
          nombre_perfil: backup.usuarios.perfiles.nombre_perfil,
          estado: backup.usuarios.perfiles.estado,
        },
      },
    };
  }

  async findOne(id: number) {
    try {
      const backups = await this.backupsRepositorio.find({
       where: { id },
      });
      return backups.map(backup => this.construirElJson2(backup));
    } catch (error) {
      console.error('Error al recuperar los backups:', error);
      throw new Error('No se pudieron recuperar los backups');
    }

    
  }

  private construirElJson2(backup: Backups): BackupDto {
    return {
      id: backup.id,
      archivos: [
        { archivo: backup.backup1 },
        { archivo: backup.backup2 },
        { archivo: backup.backup3 },
      ],
      gabinete: {
        id: backup.gabinetes.id,
        nombre_gabinete: backup.gabinetes.nombre_gabinete,
        descripcion_referencia: backup.gabinetes.descripcion_referencia,
        estado: backup.gabinetes.estado,
      },
      usuario: {
        id: backup.usuarios.id,
        username: backup.usuarios.username,
        nombre_completo: backup.usuarios.nombre_completo,
        estado: backup.usuarios.estado,
        perfiles: {
          id: backup.usuarios.perfiles.id,
          nombre_perfil: backup.usuarios.perfiles.nombre_perfil,
          estado: backup.usuarios.perfiles.estado,
        },
      },
    };
  }

  update(id: number, updateBackupDto: UpdateBackupDto) {
    return `This action updates a #${id} backup`;
  }

  remove(id: number) {
    return `This action removes a #${id} backup`;
  }
}
