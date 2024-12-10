import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGabineteDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Gabinentes } from './entities/gabinete.entity';
import { GabineteDto } from './dto/get-gabinete.dto';

@Injectable()
export class GabinetesService {
  constructor(
    @InjectRepository(Gabinentes)
    private gabineteRepositorip: Repository<Gabinentes>,
    @InjectRepository(Facultade)
    private facultadRepositorio: Repository<Facultade>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async create(createGabineteDto: CreateGabineteDto, imagenes: any) {
    // Asigna las URLs de las imágenes al DTO
    const imagen_url_1 = imagenes[0] ?? null;
    const imagen_url_2 = imagenes[1] ?? null;
    const imagen_url_3 = imagenes[2] ?? null;

    console.log(imagen_url_1, imagen_url_2, imagen_url_3);

    const gabiniteEncontrado = await this.gabineteRepositorip.findOneBy({
      nombre_gabinete: createGabineteDto.nombre_gabinete,
    });

    if (gabiniteEncontrado) {
      return {
        success: false,
        message: 'Este Gabinete Ya Existe',
      };
    }

    const usuarioEncontrado = await this.usuarioRepositorio.findOneBy({
      id: parseInt(createGabineteDto.id_usuario, 10),
    });

    if (usuarioEncontrado === null) {
      return {
        success: false,
        message: 'Usuario No Existe',
      };
    }

    const facultadEncontrado = await this.facultadRepositorio.findOneBy({
      id: parseInt(createGabineteDto.id_facultad, 10),
    });

    if (facultadEncontrado === null) {
      return {
        success: false,
        message: 'Facultad No Existe',
      };
    }

    const nuevodato = this.gabineteRepositorip.create({
      nombre_gabinete: createGabineteDto.nombre_gabinete,
      descripcion_referencia: createGabineteDto.descripcion,
      imagen_url_1: imagen_url_1,
      imagen_url_2: imagen_url_2,
      imagen_url_3: imagen_url_3,
      usuarios: usuarioEncontrado,
      facultades: facultadEncontrado,
    });

    await this.gabineteRepositorip.save(nuevodato);

    return {
      success: true,
      message: 'Se registro Correctamente',
    };
  }

  async findAll(): Promise<GabineteDto[]> {
    const gabinetes = await this.gabineteRepositorip.find({
      where: { estado: true },
    });
    return gabinetes.map((gabinete) => this.construirElJson(gabinete));
  }

  private construirElJson(gabinete: Gabinentes): GabineteDto {
    return {
      id: gabinete.id,
      nombre_gabinete: gabinete.nombre_gabinete,
      imagenes: [
        {
          imagen: gabinete.imagen_url_1,
        },
        {
          imagen: gabinete.imagen_url_2,
        },
        {
          imagen: gabinete.imagen_url_3,
        },
      ],
      descripcion_referencia: gabinete.descripcion_referencia,
      estado: gabinete.estado,
      facultades: {
        id: gabinete.facultades.id,
        facultad: gabinete.facultades.facultad,
        estado: gabinete.facultades.estado,
      },
      usuario: {
        id: gabinete.usuarios.id,
        username: gabinete.usuarios.username,
        nombre_completo: gabinete.usuarios.nombre_completo,
        estado: gabinete.usuarios.estado,
        perfiles: {
          id: gabinete.usuarios.perfiles.id,
          nombre_perfil: gabinete.usuarios.perfiles.nombre_perfil,
          estado: gabinete.usuarios.perfiles.estado,
        },
      },
    };
  }

  async findOne(id: number): Promise<GabineteDto[]> {
    const gabinetes = await this.gabineteRepositorip.find({
      where: { id: id, estado: true },
    });
    return gabinetes.map((gabinete) => this.construirElJsonbyId(gabinete));
  }

  private construirElJsonbyId(gabinete: Gabinentes): GabineteDto {
    return {
      id: gabinete.id,
      nombre_gabinete: gabinete.nombre_gabinete,
      imagenes: [
        {
          imagen: gabinete.imagen_url_1,
        },
        {
          imagen: gabinete.imagen_url_2,
        },
        {
          imagen: gabinete.imagen_url_3,
        },
      ],
      descripcion_referencia: gabinete.descripcion_referencia,
      estado: gabinete.estado,
      facultades: {
        id: gabinete.facultades.id,
        facultad: gabinete.facultades.facultad,
        estado: gabinete.facultades.estado,
      },
      usuario: {
        id: gabinete.usuarios.id,
        username: gabinete.usuarios.username,
        nombre_completo: gabinete.usuarios.nombre_completo,
        estado: gabinete.usuarios.estado,
        perfiles: {
          id: gabinete.usuarios.perfiles.id,
          nombre_perfil: gabinete.usuarios.perfiles.nombre_perfil,
          estado: gabinete.usuarios.perfiles.estado,
        },
      },
    };
  }

  async update(updateGabineteDto: UpdateGabineteDto, imagenesNueva: any) {
    // 1. Obtener el ID del gabinete desde el DTO
    const idGabinete = Number(updateGabineteDto.id_gabinete);

    // 2. Buscar el gabinete por su ID
    const gabineteRepositorip = await this.gabineteRepositorip.findOneBy({
        id: idGabinete,
    });

    // 3. Verificar si el gabinete existe
    if (!gabineteRepositorip) {
        return {
            success: false,
            message: 'Este ID Gabinete No Existe',
        };
    }

    // 4. Verificar si la facultad existe
    const facultadExistente = await this.facultadRepositorio.findOneBy({
        id: Number(updateGabineteDto.id_facultad),
    });

    if (!facultadExistente) {
        return {
            success: false,
            message: 'Este ID Facultad no Existe',
        };
    }

    // 5. Verificar si el usuario existe
    const usuarioExistente = await this.usuarioRepositorio.findOneBy({
        id: Number(updateGabineteDto.id_usuario),
    });

    if (!usuarioExistente) {
        return {
            success: false,
            message: 'Este ID Usuario no Existe',
        };
    }

    // 6. Convierte imageneseliminar de JSON string a un arreglo de objetos
    const arregloJson = JSON.parse(updateGabineteDto.imageneseliminar);
    console.log(arregloJson, imagenesNueva);

    // 7. Mapea las nuevas imágenes
    const nuevasImagenes = [
        imagenesNueva[0]?.filename,
        imagenesNueva[1]?.filename,
        imagenesNueva[2]?.filename,
    ];

    // 8. Obtiene las imágenes existentes
    const imagenesExistentes = [
        gabineteRepositorip.imagen_url_1,
        gabineteRepositorip.imagen_url_2,
        gabineteRepositorip.imagen_url_3,
    ];

    // 9. Reemplaza las imágenes en el gabinete según el arregloJson
    for (const imagen of arregloJson) {
        const index = imagenesExistentes.indexOf(imagen.imagen);
        if (index !== -1) {
            // Si la imagen existe, reemplaza con una nueva imagen
            const nuevaImagen = nuevasImagenes.find(img => img && img !== imagen.imagen);
            imagenesExistentes[index] = nuevaImagen || null; // Si no hay nueva imagen, deja como null
        }
    }

    // 10. Completa hasta tener siempre 3 imágenes sin duplicados
    const imagenesFinales = [...new Set([
        ...imagenesExistentes,
        ...nuevasImagenes,
    ].filter(Boolean))]; // Filtra valores nulos y crea un conjunto único

    // 11. Si hay menos de 3 imágenes, rellena con null
    while (imagenesFinales.length < 3) {
        imagenesFinales.push(null);
    }

    // 12. Asigna las imágenes finales a las propiedades del gabinete
    gabineteRepositorip.imagen_url_1 = imagenesFinales[0];
    gabineteRepositorip.imagen_url_2 = imagenesFinales[1];
    gabineteRepositorip.imagen_url_3 = imagenesFinales[2];

    // 13. Actualiza los otros campos del gabinete
    gabineteRepositorip.nombre_gabinete = updateGabineteDto.nombre_gabinete;
    gabineteRepositorip.descripcion_referencia = updateGabineteDto.descripcion;
    gabineteRepositorip.usuarios = usuarioExistente; // Relación con el usuario
    gabineteRepositorip.facultades = facultadExistente; // Relación con la facultad

    console.log(gabineteRepositorip);

    // 14. Guarda los cambios en el repositorio
    await this.gabineteRepositorip.save(gabineteRepositorip);

    return {
        success: true,
        message: 'Gabinete actualizado exitosamente.',
    };
}





async remove(id: number) {
  // Buscar el gabinete y cargar sus relaciones
  const gabinete = await this.gabineteRepositorip.findOne({
    where: { id, estado: true },
    relations: ['detallebackups'], // Cargar las relaciones necesarias
  });

  // Verificar si el gabinete existe
  if (!gabinete) {
    throw new HttpException('Gabinete no encontrado', HttpStatus.NOT_FOUND);
  }

  // Filtrar los `detallebackups` para incluir solo los que tienen `estado: true`
  gabinete.detallebackups = gabinete.detallebackups.filter((detalle) => detalle.estado === true);

  // Verificar si tiene relaciones activas después del filtro
  if (gabinete.detallebackups.length > 0) {
    throw new HttpException(
      `No se puede eliminar el gabinete porque está siendo usado en el módulo: Backups y el Historial de Backups`,
      HttpStatus.CONFLICT,
    );
  }

  // Buscar si el gabinete está activo
  const gabineteactivo = await this.gabineteRepositorip.findOneBy({
    id,
    estado: true,
  });

  if (!gabineteactivo) {
    throw new HttpException('Gabinete ya está eliminado o no existe', HttpStatus.NOT_FOUND);
  }

  // Actualizar el estado del gabinete a `false`
  await this.gabineteRepositorip.update(id, { estado: false });

  return { message: 'Gabinete eliminado exitosamente' };
}


}
