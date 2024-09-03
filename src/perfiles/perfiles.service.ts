import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfile } from './entities/perfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfile) private perfileRepository: Repository<Perfile>,
  ) { }

  // METODO PARA JALAR TODO LOS DATOS DE PERFILES

  findAll() {
    const perfiles = this.perfileRepository.find({
      order: { id: 'DESC' },
    });

    return perfiles;
  }

  async findOne(id: number) {
    const perfilEncontrado = await this.perfileRepository.findOneBy({
      id: id,
      estado: true,
    });

    if (!perfilEncontrado) {
      throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!perfilEncontrado.estado) {
      throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
    }

    return perfilEncontrado;
  }

  async create(createPerfileDto: CreatePerfileDto) {
    // Verificar si el perfil ya existe
    const PerfilEncontrado = await this.perfileRepository.findOneBy({
      nombre_perfil: createPerfileDto.nombre_perfil,
    });

    if (PerfilEncontrado) {
      throw new HttpException('Este dato ya está creado', HttpStatus.CONFLICT);
    }

    // Crear un nuevo registro usando los datos del DTO
    const nuevoDato = this.perfileRepository.create(createPerfileDto);

    // Guardar el nuevo registro en la base de datos
    await this.perfileRepository.save(nuevoDato);

    return { message: 'Se guardó correctamente' };
  }

  async update(id: number, updatePerfileDto: UpdatePerfileDto) {
    const perfilExistente = await this.perfileRepository.findOneBy({
      id: id,
    });

    if (!perfilExistente) {
      throw new HttpException('Dato no existe', HttpStatus.NOT_FOUND);
    }

    // Comprobar la existencia del perfil con el mismo nombre solo si el nombre es diferente
    if (updatePerfileDto.nombre_perfil !== perfilExistente.nombre_perfil) {
      const perfilConMismoNombre = await this.perfileRepository.findOneBy({
        nombre_perfil: updatePerfileDto.nombre_perfil,
      });

      if (perfilConMismoNombre) {
        throw new HttpException(
          'Dato ya existe',
          HttpStatus.CONFLICT,
        );
      }
    }
    // Actualizar el perfil
    await this.perfileRepository.update(id, updatePerfileDto);

    return { message: 'Se actualizó correctamente' };
  }

  async remove(id: number) {
    const perfilExistente = await this.perfileRepository.findOneBy({
      id: id,
      estado: true
    });

    if (!perfilExistente) {
      throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!perfilExistente.estado) {
      throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
    }

    // Actualizar el estado del perfil a false
    await this.perfileRepository.update(id, { estado: false });

    return { message: 'Dato eliminado exitosamente' };
  }
}
