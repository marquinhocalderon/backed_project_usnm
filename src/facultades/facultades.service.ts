import { Injectable } from '@nestjs/common';
import { CreateFacultadeDto } from './dto/create-facultade.dto';
import { UpdateFacultadeDto } from './dto/update-facultade.dto';

@Injectable()
export class FacultadesService {
  create(createFacultadeDto: CreateFacultadeDto) {
    return 'This action adds a new facultade';
  }

  findAll() {
    return `This action returns all facultades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} facultade`;
  }

  update(id: number, updateFacultadeDto: UpdateFacultadeDto) {
    return `This action updates a #${id} facultade`;
  }

  remove(id: number) {
    return `This action removes a #${id} facultade`;
  }
}
