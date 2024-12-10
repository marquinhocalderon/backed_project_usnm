import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetallebackupsService } from './detallebackups.service';
import { CreateDetallebackupDto } from './dto/create-detallebackup.dto';
import { UpdateDetallebackupDto } from './dto/update-detallebackup.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/auth/decorators/permission.decorator';
@UseGuards(AuthGuard)
@ApiTags('Detallebackups')
@Controller('detallebackups')
export class DetallebackupsController {
  constructor(private readonly detallebackupsService: DetallebackupsService) {}



  @Get()
  @Permission('read-detallebackups')
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
  @Permission('delete-detallebackups')
  remove(@Param('id') id: string) {
    return this.detallebackupsService.remove(+id);
  }
}
