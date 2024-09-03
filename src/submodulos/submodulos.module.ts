import { Module } from '@nestjs/common';
import { SubmodulosService } from './submodulos.service';
import { SubmodulosController } from './submodulos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubModulo } from './entities/submodulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubModulo])],
  controllers: [SubmodulosController],
  providers: [SubmodulosService],
  exports: [SubmodulosService]
})
export class SubmodulosModule {}
