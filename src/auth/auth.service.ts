import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'
@Injectable()
export class AuthService {

  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(datosFronted: LoginDto) {
    const usuario = await this.usuarioService.buscarParaLogin(
      datosFronted.username,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordValidar = await bcryptjs.compare(
      datosFronted.password,
      usuario.password,
    );

    if (!passwordValidar) {
      throw new UnauthorizedException('Password Incorrecto');
    }

    // const accesosDeModulos = await this.accesosService.obtenerDatos();

    // const accesoPerfilUsuario = accesosDeModulos.find(acceso => acceso.nombre_perfil === usuario.perfiles.nombre_perfil);

    // const modulosInactivos = accesoPerfilUsuario.modulosasignados.filter(modulo => modulo.activo === true);

    const payload = {
      sub: usuario.id,
      username: usuario.username,
      role: usuario.perfiles.nombre_perfil,
      id_perfil: usuario.perfiles.id,
      // modulosasignados :modulosInactivos
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: 60 * 60,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: 60 * 60 * 24 * 7,
    });

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}
