import { Module } from '@nestjs/common';
import { MostrararchivosService } from './mostrararchivos.service';
import { MostrararchivosController } from './mostrararchivos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [MostrararchivosController],
  providers: [MostrararchivosService],
})
export class MostrararchivosModule {}
