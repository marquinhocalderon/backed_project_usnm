import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmoduloDto {
  // Aquí puedes agregar propiedades relevantes para el DTO
}

export class Inicio {
  @ApiProperty({
    description: 'Mensaje de bienvenida al usuario',
    example: '¡Bienvenido a nuestro backend! Gabinetes-Backups Proyecto Practicas UNSM.',
  })
  mensaje_de_bienvenida: string;
}
