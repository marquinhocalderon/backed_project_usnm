import { Injectable } from '@nestjs/common';
import { CreateMostrararchivoDto } from './dto/create-mostrararchivo.dto';
import { UpdateMostrararchivoDto } from './dto/update-mostrararchivo.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MostrararchivosService {

  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
  ) {}


}
