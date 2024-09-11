import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDetallepermisoDto } from './create-detallepermiso.dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsBoolean, MaxLength, MinLength, IsString, IsArray, ArrayMinSize, IsEnum } from 'class-validator';

export class UpdateDetallepermisoDto  {

    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? parseInt(value.trim(), 10) : value)) // Convert to integer and trim whitespaces
    @IsNotEmpty({ message: 'El campo id no debe estar vacío' })
    @IsNumber({}, { message: 'El campo id debe ser de tipo numérico' })
    id: number;
    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo nombre_modulo no debe estar vacío' })
    @IsString({ message: 'El campo nombre_modulo tiene que ser una cadena de caracteres' })
    @MaxLength(50, { message: 'El campo nombre_modulo debe tener un máximo de 50 caracteres' })
    @MinLength(2, { message: 'El campo nombre_modulo debe tener un mínimo de 2 caracteres' })
    nombre_modulo: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo habilitado no debe estar vacío' })
    @IsBoolean({ message: 'El campo habilitado debe ser un valor booleano' })
    habilitado: boolean;
}

enum PermissionType {
  CREATE = 'CRUD COMPLETO (create, read, update, delete) SE DEBE MANDAR NO IMPORTA EL VALOR',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class PermisoDto {
  @ApiProperty({ enum: PermissionType })
  @IsEnum(PermissionType, { message: 'El campo type debe ser uno de los valores permitidos: create, read, update, delete' })
  type: PermissionType;

  @ApiProperty()
  @IsBoolean({ message: 'El campo value debe ser un valor booleano' })
  value: boolean;
}


export class UpdatePeticiones {
    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? parseInt(value.trim(), 10) : value)) // Convert to integer and trim whitespaces
    @IsNotEmpty({ message: 'El campo id no debe estar vacío' })
    @IsNumber({}, { message: 'El campo id debe ser de tipo numérico' })
    id: number;

     @ApiProperty({ type: [PermisoDto] })
    @IsNotEmpty({ message: 'El campo permisos no debe estar vacío' })
    @IsArray({ message: 'El campo permisos debe ser un arreglo de permisos' })
    @ArrayMinSize(1, { message: 'El campo permisos debe tener al menos un permiso' })
    permisos: {
      type: 'create' | 'read' | 'update' | 'delete';
      value: boolean;
    }[];
}
