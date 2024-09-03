import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { DetallepermisosModule } from 'src/detallepermisos/detallepermisos.module';


@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      global: true,
    }),
    DetallepermisosModule, // Asegúrate de importar el módulo aquí
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
