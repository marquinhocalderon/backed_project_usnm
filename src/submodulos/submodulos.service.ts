import { Injectable } from '@nestjs/common';
import { CreateSubmoduloDto } from './dto/create-submodulo.dto';
import { UpdateSubmoduloDto } from './dto/update-submodulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubModulo } from './entities/submodulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubmodulosService {
  constructor(
    @InjectRepository(SubModulo)
    private readonly subModuloRepository: Repository<SubModulo>,
  ) {}

  create(createSubmoduloDto: CreateSubmoduloDto) {
    return 'This action adds a new submodulo';
  }

  async findAll() {
   
    return await this.subModuloRepository.find();
}



  findOne(id: number) {
    return `This action returns a #${id} submodulo`;
  }

  update(id: number, updateSubmoduloDto: UpdateSubmoduloDto) {
    return `This action updates a #${id} submodulo`;
  }

  remove(id: number) {
    return `This action removes a #${id} submodulo`;
  }
}
