import { Injectable } from '@nestjs/common';
import { CreateDetallebackupDto } from './dto/create-detallebackup.dto';
import { UpdateDetallebackupDto } from './dto/update-detallebackup.dto';

@Injectable()
export class DetallebackupsService {
  create(createDetallebackupDto: CreateDetallebackupDto) {
    return 'This action adds a new detallebackup';
  }

  findAll() {
    return `This action returns all detallebackups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallebackup`;
  }

  update(id: number, updateDetallebackupDto: UpdateDetallebackupDto) {
    return `This action updates a #${id} detallebackup`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallebackup`;
  }
}
