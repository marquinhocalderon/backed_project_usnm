import { PartialType } from '@nestjs/swagger';
import { CreateMostrararchivoDto } from './create-mostrararchivo.dto';

export class UpdateMostrararchivoDto extends PartialType(CreateMostrararchivoDto) {}
