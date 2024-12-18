import { ApiProperty } from "@nestjs/swagger";

export class ImagenDto {
  @ApiProperty()
  imagen: string;
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

export class FacultadDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  facultad: string;

  @ApiProperty()
  estado: boolean;
}

export class GabineteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre_gabinete: string;

  @ApiProperty({ type: [ImagenDto] })
  imagenes: ImagenDto[];

  @ApiProperty()
  descripcion_referencia: string;

  @ApiProperty()
  estado: boolean;

  @ApiProperty({ type: FacultadDto })
  facultades: FacultadDto;
}

export class DocumentoDto {
  @ApiProperty()
  documento: string;
}

export class BackupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  estado: boolean;
}

export class DetalleBackupDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [DocumentoDto] })
  documentos: DocumentoDto[];

  @ApiProperty({ type: GabineteDto })
  gabinete: GabineteDto;

  @ApiProperty({ type: UsuarioDto })
  usuario: UsuarioDto;

  @ApiProperty({ type: BackupDto })
  backups: BackupDto;

  @ApiProperty()
  fecha: Date;

  @ApiProperty()
  estado: boolean;
}
