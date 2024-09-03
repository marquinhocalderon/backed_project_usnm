import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PerfilesService } from './perfiles.service';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { GetPerfilDto } from './dto/get-perfile.dto';

@ApiTags('Perfiles')
@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @ApiBody({ type: CreatePerfileDto })
  @Post()
  create(@Body() createPerfileDto: CreatePerfileDto) {
    return this.perfilesService.create(createPerfileDto);
  }

  @ApiBody({ type: [GetPerfilDto] })
  @Get()
  findAll() {
    return this.perfilesService.findAll();
  }
  
  @ApiBody({ type: [GetPerfilDto] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfilesService.findOne(+id);
  }

  @ApiBody({ type: [UpdatePerfileDto] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerfileDto: UpdatePerfileDto) {
    return this.perfilesService.update(+id, updatePerfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfilesService.remove(+id);
  }
}
