import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Perfile } from '../perfiles/entities/perfile.entity';
import * as bcryptjs from 'bcryptjs';
import { Detallepermiso } from '../detallepermisos/entities/detallepermiso.entity';
import { DetallepermisosService } from '../detallepermisos/detallepermisos.service';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { DetalleBackups } from 'src/detallebackups/entities/detallebackup.entity';
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfile) private perfilRepository: Repository<Perfile>,
    @InjectRepository(Detallepermiso)
    private detallePermisoRepository: Repository<Detallepermiso>,
    private readonly detallepermisosService: DetallepermisosService,
    @InjectRepository(Facultade) private facultad: Repository<Facultade>,
    @InjectRepository(Gabinentes) private gabinete: Repository<Gabinentes>,
    @InjectRepository(DetalleBackups)
    private backup: Repository<DetalleBackups>,
  ) {}

  // async create(createUsuarioDto: CreateUsuarioDto, imagenFilename: string) {
  //   const perfilEncontrado = await this.perfilRepository.findOneBy({
  //     id: parseInt(createUsuarioDto.id_perfil, 10),
  //     estado: true,
  //   });

  //   if (!perfilEncontrado) {
  //     throw new HttpException('Perfil no encontrado ', HttpStatus.NOT_FOUND);
  //   }

  //   const usuarioEncontrado = await this.usuarioRepository.findOneBy({
  //     username: createUsuarioDto.username,
  //   });

  //   if (usuarioEncontrado) {
  //     throw new HttpException('Usuario ya existe', HttpStatus.CONFLICT);
  //   }

  //    // Crear un nuevo usuario con la información proporcionada y el nombre del archivo
  //    const nuevodato = this.usuarioRepository.create({
  //     username: createUsuarioDto.username,
  //     password: await bcryptjs.hash(createUsuarioDto.password, 10),
  //     imagen: imagenFilename,
  //     perfiles: perfilEncontrado,
  //   });

  //   await this.usuarioRepository.save(nuevodato);

  //   return { message: 'Se registró correctamente' };

  // }

  buscarParaLogin(usuario: string) {
    return this.usuarioRepository.findOne({
      where: {
        username: usuario,
      },
      select: ['id', 'username', 'password', 'perfiles'],
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const perfilEncontrado = await this.perfilRepository.findOneBy({
      id: parseInt(createUsuarioDto.id_perfil, 10),
      estado: true,
    });

    if (!perfilEncontrado) {
      throw new HttpException('Perfil no encontrado ', HttpStatus.NOT_FOUND);
    }

    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      username: createUsuarioDto.username,
    });

    if (usuarioEncontrado) {
      throw new HttpException('Usuario ya existe', HttpStatus.CONFLICT);
    }

    // Crear un nuevo usuario con la información proporcionada y el nombre del archivo
    const nuevodato = this.usuarioRepository.create({
      username: createUsuarioDto.username,
      password: await bcryptjs.hash(createUsuarioDto.password, 10),
      nombre_completo: createUsuarioDto.nombre_completo,
      perfiles: perfilEncontrado,
    });

    await this.usuarioRepository.save(nuevodato);

    await this.detallepermisosService.create(nuevodato.id);

    return { message: 'Se registró correctamente' };
  }

  findAll() {
    const usuarios = this.usuarioRepository.find({
      order: { id: 'DESC' },
    });

    return usuarios;
  }

  async findOne(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
      estado: true,
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuarioEncontrado.estado) {
      throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
    }

    return usuarioEncontrado;
  }

  async update(id: number, updateUsuarioDto: any) {
    // Buscar el usuario existente
    const usuarioExistente = await this.usuarioRepository.findOneBy({ id });

    if (!usuarioExistente) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar si el nuevo perfil existe y está activo
    const perfilEncontrado = await this.perfilRepository.findOneBy({
      id: parseInt(updateUsuarioDto.id_perfil, 10),
      estado: true,
    });

    if (!perfilEncontrado) {
      throw new HttpException(
        'Perfil no encontrado o inactivo',
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar si el nombre de usuario es diferente y si ya existe otro usuario con el mismo nombre
    if (
      updateUsuarioDto.username &&
      updateUsuarioDto.username !== usuarioExistente.username
    ) {
      const usuarioEncontrado = await this.usuarioRepository.findOneBy({
        username: updateUsuarioDto.username,
      });

      if (usuarioEncontrado) {
        throw new HttpException(
          'El nombre de usuario ya existe',
          HttpStatus.CONFLICT,
        );
      }
    }

    // Preparar los datos de actualización
    const datosActualizacion: any = {
      username: updateUsuarioDto.username || usuarioExistente.username, // Mantener el nombre de usuario actual si no se proporciona uno nuevo
      nombre_completo:
        updateUsuarioDto.nombre_completo || usuarioExistente.nombre_completo, // Mantener el nombre completo actual si no se proporciona uno nuevo
      perfiles: perfilEncontrado, // Actualizar la relación con el nuevo perfil
    };

    // Solo actualizar la contraseña si se proporciona una nueva
    if (updateUsuarioDto.password) {
      datosActualizacion.password = await bcryptjs.hash(
        updateUsuarioDto.password,
        10,
      );
    }

    // Actualizar el usuario
    await this.usuarioRepository.update(id, datosActualizacion);

    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(id: number) {
    // Buscar el usuario y cargar sus relaciones
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['detalleBackups', 'gabinetes', 'facultades'], // Relacionar las entidades
    });
  
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Mensaje para indicar en qué entidad está siendo usado el usuario
    const relatedEntities: string[] = [];
  
    if (usuario.detalleBackups.length > 0) {
      relatedEntities.push('DetalleBackups');
    }
    if (usuario.gabinetes.length > 0) {
      relatedEntities.push('Gabinetes');
    }
    if (usuario.facultades.length > 0) {
      relatedEntities.push('Facultades');
    }
  
    // Si el usuario tiene relaciones, generar un mensaje de conflicto
    if (relatedEntities.length > 0) {
      throw new HttpException(
        `No se puede eliminar el usuario porque está siendo usado en uno de estos modulos: ${relatedEntities.join(', ')}`,
        HttpStatus.CONFLICT,
      );
    }
  
    // Buscar el usuario por ID y estado activo
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { id, estado: true },
    });
  
    if (!usuarioExistente) {
      throw new HttpException('Usuario no encontrado o ya eliminado', HttpStatus.NOT_FOUND);
    }
  
    // Si el usuario está marcado como eliminado (estado false)
    if (!usuarioExistente.estado) {
      throw new HttpException('Usuario ya eliminado', HttpStatus.NOT_FOUND);
    }
  
    // Actualizar el estado del usuario a false (marcarlo como eliminado)
    await this.usuarioRepository.update(id, { estado: false });
  
    return { message: 'Usuario eliminado correctamente' };
  }
  
}
