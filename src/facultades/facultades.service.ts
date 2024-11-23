import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFacultadeDto } from './dto/create-facultade.dto';
import { UpdateFacultadeDto } from './dto/update-facultade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facultade } from './entities/facultade.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Console } from 'console';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';

@Injectable()
export class FacultadesService {
  constructor(
    @InjectRepository(Facultade)
    private facultadRepositorio: Repository<Facultade>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
    @InjectRepository(Gabinentes) private gabinete: Repository<Gabinentes>,
  ) {}

  async create(createFacultadeDto: CreateFacultadeDto, imagenes: any) {
    const imagen_url_1 = imagenes[0] ?? null;

    const facultadEncontrado = await this.facultadRepositorio.findOneBy({
      facultad: createFacultadeDto.facultad,
    });

    if (facultadEncontrado) {
      return { message: 'Esta Facultad ya esta registrada', success: false };
    }

    const usuarioEncontrado = await this.usuarioRepositorio.findOneBy({
      id: parseInt(createFacultadeDto.id_usuario, 10),
    });

    if (usuarioEncontrado === null) {
      return { message: 'Esta Usuario no esta registrado', success: false };
    }

    // Crear un nuevo usuario con la información proporcionada y el nombre del archivo
    const nuevodato = this.facultadRepositorio.create({
      facultad: createFacultadeDto.facultad,
      usuarios: usuarioEncontrado,
      imagen: imagen_url_1,
    });

    await this.facultadRepositorio.save(nuevodato);

    return {
      message: 'Se registró correctamente',
      success: true,
    };
  }

  findAll() {
    const facultade = this.facultadRepositorio.find({
      order: { id: 'DESC' },
      where: { estado: true },
    });

    return facultade;
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

  async update(updateFacultadeDto: UpdateFacultadeDto, imagenes: any) {
    const imagen_url_1 =
      imagenes && imagenes.length > 0 ? imagenes[0].filename : null;

    const facultadExistente = await this.facultadRepositorio.findOneBy({
      id: Number(updateFacultadeDto.id_facultad),
    });

    if (!facultadExistente) {
      return {
        message: 'Facultad No Existe',
        success: false,
      };
    }

    // Verificar si el nombre de la facultad cambió y comprobar duplicados
    if (updateFacultadeDto.facultad !== facultadExistente.facultad) {
      const mismoNombre = await this.facultadRepositorio.findOneBy({
        facultad: updateFacultadeDto.facultad,
      });

      if (mismoNombre) {
        return {
          message: 'Facultad ya Existe este Nombre',
          success: false,
        };
      }
    }

    const usuarioExistente = await this.usuarioRepositorio.findOneBy({
      id: Number(updateFacultadeDto.id_usuario),
    });

    if (!usuarioExistente) {
      return {
        message: 'Usuario No Existe',
        success: false,
      };
    }

    // Crear un objeto con los datos actualizados y conservar la imagen si no se envía una nueva
    const datosActualizados = {
      facultad: updateFacultadeDto.facultad,
      usuarios: usuarioExistente,
      imagen: imagen_url_1 ?? facultadExistente.imagen, // Mantener la imagen existente si no hay una nueva
    };

    await this.facultadRepositorio.update(
      updateFacultadeDto.id_facultad,
      datosActualizados,
    );

    return { message: 'Se actualizó correctamente', success: true };
  }

  async remove(id: number) {
    // Buscar el gabinete y cargar sus relaciones
    const facultad = await this.facultadRepositorio.findOne({
      where: { id },
      relations: ['gabinetes'], // Cargar las relaciones necesarias
    });
  
    // Verificar si el gabinete existe
    if (!facultad) {
      throw new HttpException('Gabinete no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Verificar si tiene relaciones activas
    if (facultad.gabinetes && facultad.gabinetes.length > 0) {
      throw new HttpException(
        `No se puede eliminar la facultad porque está siendo usado en el módulo: Gabinetes`,
        HttpStatus.CONFLICT,
      );
    }
  
    // Buscar si el gabinete está activo
    const facultadactivo = await this.facultadRepositorio.findOneBy({
      id,
      estado: true,
    });
  
    if (!facultadactivo) {
      throw new HttpException('La facultad ya está eliminado o no existe', HttpStatus.NOT_FOUND);
    }
  
    // Actualizar el estado del gabinete a `false`
    await this.facultadRepositorio.update(id, { estado: false });
  
    return { message: 'Facultad eliminada exitosamente' };
  }
  
}
