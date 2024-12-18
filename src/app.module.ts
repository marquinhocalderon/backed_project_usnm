import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilesModule } from './perfiles/perfiles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MostrararchivosModule } from './mostrararchivos/mostrararchivos.module';
import { AuthModule } from './auth/auth.module';
import { ModulosModule } from './modulos/modulos.module';
import { SubmodulosModule } from './submodulos/submodulos.module';
import { FacultadesModule } from './facultades/facultades.module';
import { GabinetesModule } from './gabinetes/gabinetes.module';
import { BackupsModule } from './backups/backups.module';
import { DetallebackupsModule } from './detallebackups/detallebackups.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities:[__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: process.env.POSTGRES_SSL === "true",
    extra: {
      ssl:
        process.env.POSTGRES_SSL === "true"
          ? {
            rejectUnauthorized: false,
          }
          : null,
    },
  }),

  PerfilesModule,

  UsuariosModule,

  MostrararchivosModule,

  AuthModule,

  ModulosModule,

  SubmodulosModule,

  FacultadesModule,

  GabinetesModule,

  BackupsModule,

  DetallebackupsModule,







],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
