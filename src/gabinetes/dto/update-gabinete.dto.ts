import { PartialType } from '@nestjs/swagger';
import { CreateGabineteDto } from './create-gabinete.dto';

export class UpdateGabineteDto extends PartialType(CreateGabineteDto) {}
