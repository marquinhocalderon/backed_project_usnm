import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetallepermisoDto } from './dto/create-detallepermiso.dto';
import {
  UpdateDetallepermisoDto,
  UpdatePeticiones,
} from './dto/update-detallepermiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Repository } from 'typeorm';
import { SubModulo } from 'src/submodulos/entities/submodulo.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Detallepermiso } from './entities/detallepermiso.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ModulosService } from 'src/modulos/modulos.service';
import { read } from 'fs';
import { SubmodulosService } from 'src/submodulos/submodulos.service';

@Injectable()
export class DetallepermisosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Detallepermiso)
    private detallePermisoRepository: Repository<Detallepermiso>,
    private readonly submodulosService: SubmodulosService,
  ) {}

  async create(idUsuario: number) {
    // Obtener todos los sub-módulos desde la base de datos
    const datosrecogidos = await this.submodulosService.findAll();

    // Función para verificar existencia y estado de una entidad
    const verificarEntidad = async (
      repository: any,
      id: number,
      tipo: string,
    ) => {
      const entidad = await repository.findOneBy({ id, estado: true });
      if (!entidad) {
        throw new HttpException(`${tipo} no encontrado`, HttpStatus.NOT_FOUND);
      }
      return entidad;
    };

    // Verificar existencia y estado del usuario
    const usuarioEncontrado = await verificarEntidad(
      this.usuarioRepository,
      idUsuario,
      'Usuario',
    );

    // Iterar sobre los sub-módulos para crear permisos
    for (const subModulo of datosrecogidos) {
      const detallePermiso = new Detallepermiso();

      // Asignar entidades completas a las propiedades de relación
      detallePermiso.usuario = usuarioEncontrado;
      detallePermiso.sub_modulo = subModulo;
      // Aquí podrías agregar la lógica para obtener el módulo relacionado si es necesario

      // Guardar el detallePermiso en la base de datos
      await this.detallePermisoRepository.save(detallePermiso);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Permisos creados correctamente',
    };
  }

  async findAll(): Promise<any> {
    // Obtener todos los detalles de permisos
    const detallePermisos = await this.detallePermisoRepository.find({
      relations: ['usuario', 'sub_modulo', 'sub_modulo.modulos'],
    });

    // Agrupar datos por usuario
    const usuarios = new Map<number, any>();

    detallePermisos.forEach((detalle) => {
      const { usuario } = detalle;

      // Filtrar usuarios activos
      if (usuario.estado) {
        // Agrupar usuarios
        if (!usuarios.has(usuario.id)) {
          usuarios.set(usuario.id, {
            id: usuario.id,
            username: usuario.username,
            nombre_completo: usuario.nombre_completo,
            estado: usuario.estado,
            perfil: {
              id: usuario.perfiles.id,
              nombre_perfil: usuario.perfiles.nombre_perfil,
              estado: usuario.perfiles.estado,
            },
          });
        }
      }
    });

    // Convertir los mapas a arreglos y ordenar
    const resultado = Array.from(usuarios.values()).sort((a, b) => a.id - b.id);

    return resultado;
  }

  async findOne(id: number): Promise<any[]> {
    // Verificar si el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['perfiles'], // Asegúrate de incluir las relaciones necesarias
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Obtener todos los detalles de permisos para el usuario específico
    const detallePermisos = await this.detallePermisoRepository.find({
      where: { usuario: { id } },
      relations: ['usuario', 'sub_modulo', 'sub_modulo.modulos'],
    });

    // Verificar si no se encontraron permisos para el usuario
    if (detallePermisos.length === 0) {
      throw new NotFoundException(
        'No se encontraron permisos para este usuario.',
      );
    }

    // Agrupar datos por módulo
    const modulos = new Map<number, any>();

    detallePermisos.forEach((detalle) => {
      const { sub_modulo } = detalle;

      // Agrupar módulos y sub-módulos
      const moduloId = sub_modulo.modulos.id;
      if (!modulos.has(moduloId)) {
        modulos.set(moduloId, {
          id: moduloId,
          nombre_modulo: sub_modulo.modulos.nombre_modulo,
          habilitado: detalle.habilitado,
          sub_modulos: [],
        });
      }

      const modulo = modulos.get(moduloId);
      modulo.sub_modulos.push({
        id: sub_modulo.id,
        nombre_submodulo: sub_modulo.nombre_submodulo,
        permisos: [
          { type: 'create', value: detalle.create },
          { type: 'read', value: detalle.read },
          { type: 'update', value: detalle.update },
          { type: 'delete', value: detalle.delete },
        ],
      });
    });

    // Ordenar módulos por id en forma descendente
    const sortedModulos = Array.from(modulos.values()).sort(
      (a, b) => a.id - b.id,
    );

    // Filtrar los módulos habilitados y eliminar los submódulos
    const modulosHabilitados = sortedModulos
      .filter((modulo) => modulo.habilitado)
      .map((modulo) => ({
        id: modulo.id,
        nombre_modulo: modulo.nombre_modulo,
        habilitado: modulo.habilitado,
      }));

    // Estructurar los datos finales como un arreglo
    const resultado = [
      {
        usuario: [
          {
            id: usuario.id,
            username: usuario.username,
            nombre_completo: usuario.nombre_completo,
            estado: usuario.estado,
            perfil: {
              id: usuario.perfiles.id,
              nombre_perfil: usuario.perfiles.nombre_perfil,
              estado: usuario.perfiles.estado,
            },
          },
        ],
        modulos_para_actualizar: sortedModulos,
        modulos_para_mostrar_menu: modulosHabilitados,
      },
    ];

    return resultado;
  }

  async findOne2(id: number): Promise<any[]> {
    // Verificar si el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['perfiles'], // Asegúrate de incluir las relaciones necesarias
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Obtener todos los detalles de permisos para el usuario específico
    const detallePermisos = await this.detallePermisoRepository.find({
      where: { usuario: { id } },
      relations: ['usuario', 'sub_modulo', 'sub_modulo.modulos'],
    });

    // Verificar si no se encontraron permisos para el usuario
    if (detallePermisos.length === 0) {
      throw new NotFoundException(
        'No se encontraron permisos para este usuario.',
      );
    }

    // Agrupar datos por módulo
    const modulos = new Map<number, any>();

    detallePermisos.forEach((detalle) => {
      const { sub_modulo } = detalle;

      // Agrupar módulos y sub-módulos
      const moduloId = sub_modulo.modulos.id;
      if (!modulos.has(moduloId)) {
        modulos.set(moduloId, {
          id: moduloId,
          nombre_modulo: sub_modulo.modulos.nombre_modulo,
          habilitado: detalle.habilitado,
          sub_modulos: [],
        });
      }

      const modulo = modulos.get(moduloId);
      modulo.sub_modulos.push({
        id: sub_modulo.id,
        nombre_submodulo: sub_modulo.nombre_submodulo,
        permisos: [
          { type: 'create', value: detalle.create },
          { type: 'read', value: detalle.read },
          { type: 'update', value: detalle.update },
          { type: 'delete', value: detalle.delete },
        ],
      });
    });

    // Ordenar módulos por id en forma descendente
    const sortedModulos = Array.from(modulos.values()).sort(
      (a, b) => b.id - a.id,
    );

    // Filtrar los módulos habilitados
    const modulosHabilitados = sortedModulos.filter(
      (modulo) => modulo.habilitado === true,
    );

    // Estructurar los datos finales como un arreglo
    const resultado = [
      {
        usuario: [
          {
            id: usuario.id,
            username: usuario.username,
            nombre_completo: usuario.nombre_completo,
            estado: usuario.estado,
            perfil: {
              id: usuario.perfiles.id,
              nombre_perfil: usuario.perfiles.nombre_perfil,
              estado: usuario.perfiles.estado,
            },
          },
        ],
        modulos_para_actualizar: modulosHabilitados, // Solo módulos habilitados con submódulos
      },
    ];

    return resultado;
  }

  async update(
    id: number,
    updateDetallepermisoDtos: UpdateDetallepermisoDto[],
  ): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    for (const updateDetallepermisoDto of updateDetallepermisoDtos) {
      const { id: moduloId, habilitado } = updateDetallepermisoDto;

      // Obtener todos los detalles de permisos para el módulo específico del usuario
      const detallePermisos = await this.detallePermisoRepository.find({
        where: { usuario: { id }, sub_modulo: { modulos: { id: moduloId } } },
        relations: ['sub_modulo'],
      });

      if (detallePermisos.length === 0) {
        throw new NotFoundException(
          `No se encontraron permisos para el módulo con id ${moduloId} para este usuario.`,
        );
      }

      for (const detalle of detallePermisos) {
        detalle.habilitado = habilitado;
        if (!habilitado) {
          detalle.create = false;
          detalle.read = false;
          detalle.update = false;
          detalle.delete = false;
        }

        await this.detallePermisoRepository.save(detalle);
      }
    }

    return { message: 'Permisos actualizados correctamente' };
  }

  async updatePeticiones(
    id: number,
    updateDetallepermisoDtos: UpdatePeticiones[],
  ): Promise<any> {
    // Verificar si el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    for (const { id: subModuloId, permisos } of updateDetallepermisoDtos) {
      // Obtener todos los detalles de permisos para el submódulo específico del usuario
      const detallePermisos = await this.detallePermisoRepository.find({
        where: { usuario: { id }, sub_modulo: { id: subModuloId } },
        relations: ['sub_modulo'],
      });
  
      if (detallePermisos.length === 0) {
        throw new NotFoundException(
          `No se encontraron permisos para el submódulo con id ${subModuloId} para este usuario.`,
        );
      }
  
      for (const detalle of detallePermisos) {
        // Actualizar permisos según el valor recibido
        detalle.create =
          permisos.find((p) => p.type === 'create')?.value ?? false;
        detalle.read = permisos.find((p) => p.type === 'read')?.value ?? false;
        detalle.update =
          permisos.find((p) => p.type === 'update')?.value ?? false;
        detalle.delete =
          permisos.find((p) => p.type === 'delete')?.value ?? false;
  
        await this.detallePermisoRepository.save(detalle);
      }
    }
  
    return { message: 'Permisos actualizados correctamente' };
  }
  

  remove(id: number) {
    return `This action removes a #${id} detallepermiso`;
  }
}
