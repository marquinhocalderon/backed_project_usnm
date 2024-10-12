import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGabineteDto } from './create-gabinete.dto';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class ArregloImagenesBorrar {
    @ApiProperty()
    @IsNotEmpty({ message: 'El campo imagen no debe estar vacío' })
    @IsString({ message: 'El campo imagen tiene que ser una cadena de caracteres' })
    @MinLength(2, { message: 'El campo imagen debe tener al menos 2 caracteres' })
    imagen: string;

}

export class UpdateGabineteDto {
    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo nombre_gabinete no debe estar vacío' })
    @IsString({ message: 'El campo nombre_gabinete tiene que ser una cadena de caracteres' })
    @MaxLength(16, { message: 'El campo nombre_gabinete debe 16 caracteres como maximo' })
    @MinLength(2, { message: 'El campo nombre_gabinete debe 2 caracteres como minimo' })
    nombre_gabinete: string;


    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo descripcion no debe estar vacío' })
    @IsString({ message: 'El campo descripcion tiene que ser una cadena de caracteres' })
    @MinLength(4, { message: 'El campo descripcion debe 4 caracteres como minimo' })
    descripcion: string;


    
    @ApiProperty()
    @IsNotEmpty({ message: 'El id_usuario no debe estar vacío' })
    @IsString({ message: "el campo id_usuario DEBE MANDARSE EN STRING" })
    @MinLength(1, { message: 'El campo id_usuario debe 1 caracteres como minimo' })
    id_usuario: string


    
    @ApiProperty()
    @IsNotEmpty({ message: 'El id_facultad no debe estar vacío' })
    @IsString({ message: "el campo id_facultad DEBE MANDARSE EN STRING" })
    @MinLength(1, { message: 'El campo id_facultad debe 1 caracteres como minimo' })
    id_facultad: string


    @ApiProperty()
    @IsNotEmpty({ message: 'El id_gabinete no debe estar vacío' })
    @IsString({ message: "el campo id_gabinete DEBE MANDARSE EN STRING" })
    @MinLength(1, { message: 'El campo id_gabinete debe 1 caracteres como minimo' })
    id_gabinete: string

    @ApiProperty()
    @IsOptional()
    imageneseliminar: string

}
