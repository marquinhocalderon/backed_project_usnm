import { Module } from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { ModulosController } from './modulos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modulo } from './entities/modulo.entity';
import { DetallepermisosModule } from '../detallepermisos/detallepermisos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Modulo]),DetallepermisosModule],
  controllers: [ModulosController],
  providers: [ModulosService],
  exports: [ModulosService]
})
export class ModulosModule {}
