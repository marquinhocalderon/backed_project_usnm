import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Inicio } from './submodulos/dto/create-submodulo.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({ type: Inicio })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
