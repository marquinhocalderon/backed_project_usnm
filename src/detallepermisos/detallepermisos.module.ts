import { Module } from '@nestjs/common';
import { DetallepermisosService } from './detallepermisos.service';
import { DetallepermisosController } from './detallepermisos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModulo } from 'src/submodulos/entities/submodulo.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Detallepermiso } from './entities/detallepermiso.entity';
import { SubmodulosModule } from '../submodulos/submodulos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Detallepermiso, SubModulo, Usuario, Modulo]),
    SubmodulosModule // Importa el módulo de submódulos
  ],
  controllers: [DetallepermisosController],
  providers: [DetallepermisosService],
  exports: [DetallepermisosService]
})
export class DetallepermisosModule {}
