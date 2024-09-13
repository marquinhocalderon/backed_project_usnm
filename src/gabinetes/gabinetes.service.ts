import { Injectable } from '@nestjs/common';
import { CreateGabineteDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';

@Injectable()
export class GabinetesService {
  create(createGabineteDto: CreateGabineteDto) {
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
