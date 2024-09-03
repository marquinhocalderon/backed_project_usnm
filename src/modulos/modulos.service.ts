import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modulo } from './entities/modulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo) private moduloRepository: Repository<Modulo>,
  ) {}

  async create(createModuloDto: CreateModuloDto) {
       const moduloEncontrado = await this.moduloRepository.findOneBy({
        nombre_modulo: createModuloDto.nombre_modulo,
      });
  
      if (moduloEncontrado) {
        throw new HttpException('Este dato ya está creado', HttpStatus.CONFLICT);
      }
  
      // Crear un nuevo registro usando los datos del DTO
      const nuevoDato = this.moduloRepository.create(createModuloDto);
  
      // Guardar el nuevo registro en la base de datos
      await this.moduloRepository.save(nuevoDato);
  
      return { message: 'Se guardó correctamente' };
  }

  findAll() {
    const modulos = this.moduloRepository.find({
      order: { id: 'DESC' },
    });

    return modulos;
  }

  async findOne(id: number) {
    const moduloEncontrado = await this.moduloRepository.findOneBy({
      id: id,
      estado: true,
    });

    if (!moduloEncontrado) {
      throw new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!moduloEncontrado.estado) {
      throw new HttpException('Dato Eliminado', HttpStatus.NOT_FOUND);
    }

    return moduloEncontrado;
  }

  update(id: number, updateModuloDto: UpdateModuloDto) {
    return `This action updates a #${id} modulo`;
  }

  remove(id: number) {
    return `This action removes a #${id} modulo`;
  }
}
