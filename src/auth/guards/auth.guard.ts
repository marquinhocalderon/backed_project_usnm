import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { DetallepermisosService } from 'src/detallepermisos/detallepermisos.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly detallepermisosService: DetallepermisosService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extraerTokenDelEncabezado(request);



    if (!token) {
      throw new UnauthorizedException(
        'No se ha proporcionado un Token de acceso',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN,
      });

      const idusuario = payload.sub;

      // Obtener el nombre del decorador (permisos requeridos)
      const permisosRequeridos = this.reflector.get<string>(
        PERMISSION_KEY,
        context.getHandler(),
      );

      if (!permisosRequeridos) {
        throw new UnauthorizedException('Error, Tu decorador en tu controlador de tu backend no esta declarado que permiso CRUD tiene, por favor declaralo');
      }

      const partes = permisosRequeridos.split('-');
      const tipoPermiso = partes[0]; // 'create', 'read', 'update', 'delete'
      const subModuloNombre = partes[1]; // 'categorias'

      // Obtener los permisos del usuario
      const resultadosPermisos = await this.detallepermisosService.findOne(idusuario);
  
      // Verificar si la propiedad es un array de módulos
      if (!Array.isArray(resultadosPermisos[0].modulos_para_actualizar)) {
        throw new UnauthorizedException('Formato de permisos incorrecto');
      }

      // Buscar el sub-módulo dentro de los módulos
      const subModuloEncontrado = resultadosPermisos[0].modulos_para_actualizar
        .flatMap(modulo => modulo.sub_modulos) // Aplana el array de sub-módulos
        .find(submodulo => submodulo.nombre_submodulo === subModuloNombre);

      // Verificar si se encontró el sub-módulo
      if (!subModuloEncontrado) {
        throw new UnauthorizedException(`Sub-módulo '${subModuloNombre}' no encontrado`);
      }

      // Verificar si el permiso específico está habilitado
      const permiso = subModuloEncontrado.permisos.find(p => p.type === tipoPermiso);

      if (permiso && permiso.value) {
        return true; // Permite el acceso si el sub-módulo y el permiso son válidos
      } else {
        throw new UnauthorizedException(`No hay permiso para '${subModuloNombre}' en la petición '${tipoPermiso}'`);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token vencido');
      }
      // Diferenciar entre el error de permisos y el error de token
      throw new UnauthorizedException(
        error.response?.message || 'Error en la autenticación o permisos',
      );
    }
  }

  private extraerTokenDelEncabezado(request: Request): string | undefined {
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}
