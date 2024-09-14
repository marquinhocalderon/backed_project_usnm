import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFacultadeDto } from './dto/create-facultade.dto';
import { UpdateFacultadeDto } from './dto/update-facultade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facultade } from './entities/facultade.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Console } from 'console';

@Injectable()
export class FacultadesService {
  constructor(
    @InjectRepository(Facultade)
    private facultadRepositorio: Repository<Facultade>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async create(createFacultadeDto: CreateFacultadeDto) {


    const facultadEncontrado = await this.facultadRepositorio.findOneBy({
        facultad: createFacultadeDto.facultad,
    });

    if (facultadEncontrado) {
        throw new HttpException(
            'Facultad encontrada en la BD',
            HttpStatus.CONFLICT,
        );
    }

    const usuarioEncontrado = await this.usuarioRepositorio.findOneBy({
        id: parseInt(createFacultadeDto.id_usuario, 10),
    });


    if (usuarioEncontrado === null) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Crear un nuevo usuario con la información proporcionada y el nombre del archivo
    const nuevodato = this.facultadRepositorio.create({
        facultad: createFacultadeDto.facultad,
        usuarios: usuarioEncontrado,
    });

    await this.facultadRepositorio.save(nuevodato);

    return { message: 'Se registró correctamente' };
}


  findAll() {
    const perfiles = this.facultadRepositorio.find({
      order: { id: 'DESC' },
    });

    return perfiles;
  }
  async findOne(id: number) {
    const facultadEncontrado = await this.facultadRepositorio.findOneBy({
      id: id,
      estado: true,
    });

    if (!facultadEncontrado) {
      throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!facultadEncontrado.estado) {
      throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
    }

    return facultadEncontrado;
  }

 async update(id: number, updateFacultadeDto: UpdateFacultadeDto) {
    const facultadExistente = await this.facultadRepositorio.findOneBy({
      id: id,
    });

    if (!facultadExistente) {
      throw new HttpException('Dato no existe', HttpStatus.NOT_FOUND);
    }

    // Comprobar la existencia de nuevo dato
    if (updateFacultadeDto.facultad !== facultadExistente.facultad) {
      const mismoNombre = await this.facultadRepositorio.findOneBy({
        facultad: updateFacultadeDto.facultad,
      });

      if (mismoNombre) {
        throw new HttpException(
          'Dato ya existe',
          HttpStatus.CONFLICT,
        );
      }
    }
    // Actualizar 
    await this.facultadRepositorio.update(id, updateFacultadeDto);

    return { message: 'Se actualizó correctamente' };
}

async remove(id: number) {
  const existeEsteDato = await this.facultadRepositorio.findOneBy({
    id: id,
    estado: true
  });

  if (!existeEsteDato) {
    throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
  }

  if (!existeEsteDato.estado) {
    throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
  }

  // Actualizar el estado del perfil a false
  await this.facultadRepositorio.update(id, { estado: false });

  return { message: 'Dato eliminado exitosamente' };
}

}
