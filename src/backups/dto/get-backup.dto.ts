import { ApiProperty } from '@nestjs/swagger';

export class FileDocumentoTxt {
  @ApiProperty()
  archivo: string;
}

export class PerfilDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_perfil: string;

  @ApiProperty()
  estado: boolean;
}

export class UsuarioDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nombre_completo: string;

  @ApiProperty()
  estado: boolean;

  @ApiProperty({ type: PerfilDto })
  perfiles: PerfilDto;
}

export class GabineteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_gabinete: string;

  @ApiProperty()
  descripcion_referencia: string;

  @ApiProperty()
  estado: boolean;
}

export class BackupDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [FileDocumentoTxt] })
  archivos: FileDocumentoTxt[];

  @ApiProperty({ type: UsuarioDto })
  usuario: UsuarioDto;

  @ApiProperty({ type: GabineteDto })
  gabinete: GabineteDto;
}
