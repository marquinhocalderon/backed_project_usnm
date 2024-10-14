import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallebackupsService } from './detallebackups.service';
import { CreateDetallebackupDto } from './dto/create-detallebackup.dto';
import { UpdateDetallebackupDto } from './dto/update-detallebackup.dto';

@Controller('detallebackups')
export class DetallebackupsController {
  constructor(private readonly detallebackupsService: DetallebackupsService) {}

  @Post()
  create(@Body() createDetallebackupDto: CreateDetallebackupDto) {
    return this.detallebackupsService.create(createDetallebackupDto);
  }

  @Get()
  findAll() {
    return this.detallebackupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallebackupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallebackupDto: UpdateDetallebackupDto) {
    return this.detallebackupsService.update(+id, updateDetallebackupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallebackupsService.remove(+id);
  }
}
