import { PartialType } from '@nestjs/swagger';
import { CreateDetallebackupDto } from './create-detallebackup.dto';

export class UpdateDetallebackupDto extends PartialType(CreateDetallebackupDto) {}
