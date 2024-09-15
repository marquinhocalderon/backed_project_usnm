import { ApiProperty } from '@nestjs/swagger';

// Define the Permission DTO
export class PermissionDto {
  @ApiProperty({ example: 'create' })
  type: string;

  @ApiProperty({ example: true })
  value: boolean;
}

// Define the SubModule DTO
export class SubModuloDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'usuarios' })
  nombre_submodulo: string;

  @ApiProperty({ type: [PermissionDto] })
  permisos: PermissionDto[];
}

export class ModulosParaMenu {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'seguridad' })
  nombre_modulo: string;

  @ApiProperty({ example: false })
  habilitado: boolean;
}

// Define the Module DTO
export class ModuloDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'seguridad' })
  nombre_modulo: string;

  @ApiProperty({ example: false })
  habilitado: boolean;

  @ApiProperty({ type: [SubModuloDto] })
  sub_modulos: SubModuloDto[];
}



// Define the Perfil DTO
export class PerfilDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty()
  nombre_perfil: string;

  @ApiProperty({ example: true })
  estado: boolean;
}

// Define the User DTO
export class UsuarioDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'FISI UNSM' })
  username: string;

  @ApiProperty()
  nombre_completo: string;

  @ApiProperty({ type: [PerfilDto] })
  perfil: PerfilDto[];
}

export class UsuarioDto2 {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nombre_completo: string;

  estado: boolean;

  @ApiProperty({ type: [PerfilDto] })
  perfil: PerfilDto[];
}

// Define the main DTO that includes arrays of users and modules
export class MainDto {
  @ApiProperty({ type: [UsuarioDto] })
  usuario: UsuarioDto[];

  @ApiProperty({ type: [ModuloDto] })
  modulos_para_actualizar: ModuloDto[];

  @ApiProperty({ type: [ModulosParaMenu] })
  modulos_para_mostrar_menu: ModulosParaMenu[];
}


