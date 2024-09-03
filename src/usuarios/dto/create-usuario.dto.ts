import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo username no debe estar vacío' })
    @IsString({ message: 'El campo username tiene que ser una cadena de caracteres' })
    @MaxLength(16, { message: 'El campo username debe 16 caracteres como maximo' })
    @MinLength(4, { message: 'El campo username debe 4 caracteres como minimo' })
    username: string;

    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo nombre_completo no debe estar vacío' })
    @IsString({ message: 'El campo nombre_completo tiene que ser una cadena de caracteres' })
    @MaxLength(100, { message: 'El campo nombre_completo debe 100 caracteres como maximo' })
    @MinLength(4, { message: 'El campo nombre_completo debe 4 caracteres como minimo' })
    nombre_completo: string;

    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo password no debe estar vacío' })
    @IsString({ message: 'El campo password tiene que ser una cadena de caracteres' })
    @MaxLength(16, { message: 'El campo password debe 16 caracteres como maximo' })
    @MinLength(4, { message: 'El campo password debe 4 caracteres como minimo' })
    password: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'El id_perfil no debe estar vacío' })
    @IsString({ message: "el campo id_perfil DEBE MANDARSE EN STRING" })
    @MaxLength(100, { message: 'El campo id_perfil debe 100 caracteres como maximo' })
    @MinLength(1, { message: 'El campo id_perfil debe 1 caracteres como minimo' })
    id_perfil: string

}
