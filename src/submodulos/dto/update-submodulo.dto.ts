import { PartialType } from '@nestjs/swagger';
import { CreateSubmoduloDto } from './create-submodulo.dto';

export class UpdateSubmoduloDto extends PartialType(CreateSubmoduloDto) {}
