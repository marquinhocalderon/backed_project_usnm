import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GabinetesService } from './gabinetes.service';
import { CreateGabineteDto } from './dto/create-gabinete.dto';
import { UpdateGabineteDto } from './dto/update-gabinete.dto';

@Controller('gabinetes')
export class GabinetesController {
  constructor(private readonly gabinetesService: GabinetesService) {}

  @Post()
  create(@Body() createGabineteDto: CreateGabineteDto) {
    return this.gabinetesService.create(createGabineteDto);
  }

  @Get()
  findAll() {
    return this.gabinetesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gabinetesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGabineteDto: UpdateGabineteDto) {
    return this.gabinetesService.update(+id, updateGabineteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gabinetesService.remove(+id);
  }
}
