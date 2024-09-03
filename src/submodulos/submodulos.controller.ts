import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmodulosService } from './submodulos.service';
import { CreateSubmoduloDto } from './dto/create-submodulo.dto';
import { UpdateSubmoduloDto } from './dto/update-submodulo.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';


@Controller('submodulos')
export class SubmodulosController {
  constructor(private readonly submodulosService: SubmodulosService) {}
  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createSubmoduloDto: CreateSubmoduloDto) {
    return this.submodulosService.create(createSubmoduloDto);
  }
  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.submodulosService.findAll();
  }
  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submodulosService.findOne(+id);
  }
  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmoduloDto: UpdateSubmoduloDto) {
    return this.submodulosService.update(+id, updateSubmoduloDto);
  }
  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submodulosService.remove(+id);
  }
}
