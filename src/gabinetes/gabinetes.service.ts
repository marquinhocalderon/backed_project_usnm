import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      imagen_url_3 : imagen_url_3,
      usuarios: usuarioEncontrado,
      facultades: facultadEncontrado,
    });
  
    await this.gabineteRepositorip.save(nuevodato);
  
    return {
      success: true,
      message: 'Se registro Correctamente',
    };
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
