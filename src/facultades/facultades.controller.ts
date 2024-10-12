import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { FacultadesService } from './facultades.service';
import { CreateFacultadeDto } from './dto/create-facultade.dto';
import { UpdateFacultadeDto } from './dto/update-facultade.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
@UseGuards(AuthGuard)
@Controller('facultades')
export class FacultadesController {
  constructor(private readonly facultadesService: FacultadesService) {}

  @Post()
  @Permission('create-facultades')
  @UseInterceptors(FileInterceptor('')) // Interceptor para procesar form-data
  create(@Body() createFacultadeDto: CreateFacultadeDto) {
    return this.facultadesService.create(createFacultadeDto);
  }

  @Get()
  @Permission('read-facultades')
  findAll() {
    return this.facultadesService.findAll();
  }

  @Get(':id')
  @Permission('read-facultades')
  findOne(@Param('id') id: string) {
    return this.facultadesService.findOne(+id);
  }

  @Patch(':id')
  @Permission('update-facultades')
  @UseInterceptors(FileInterceptor('')) // Interceptor para procesar form-data
  update(@Param('id') id: string, @Body() updateFacultadeDto: UpdateFacultadeDto) {
    console.log(updateFacultadeDto);  
    return this.facultadesService.update(+id, updateFacultadeDto);
  }

  @Delete(':id')
  @Permission('delete-facultades')
  remove(@Param('id') id: string) {
    return this.facultadesService.remove(+id);
  }
}
