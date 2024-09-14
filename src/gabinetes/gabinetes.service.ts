import { Injectable } from '@nestjs/common';
import { CreateGabineteDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';
import { Facultade } from 'src/facultades/entities/facultade.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Gabinentes } from './entities/gabinete.entity';

@Injectable()
export class GabinetesService {
  constructor(
    @InjectRepository(Gabinentes)
    private gabineteRepositorip: Repository<Gabinentes>,
    @InjectRepository(Facultade)
    private facultadRepositorio: Repository<Facultade>,
    @InjectRepository(Usuario) private usuarioRepositorio: Repository<Usuario>,
  ) {}

  create(createGabineteDto: CreateGabineteDto, imagenes: any) {
    // Asigna las URLs de las imágenes al DTO
    const imagen_url_1  = imagenes[0] ?? null;;
    const imagen_url_2= imagenes[1] ?? null;;
    const imagen_url_3 = imagenes[2] ?? null;;

    console.log(imagen_url_1, imagen_url_2, imagen_url_3);



    return 'This action adds a new gabinete';
  }

  findAll() {
    return `This action returns all gabinetes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gabinete`;
  }

  update(id: number, updateGabineteDto: UpdateGabineteDto) {
    return `This action updates a #${id} gabinete`;
  }

  remove(id: number) {
    return `This action removes a #${id} gabinete`;
  }
}
