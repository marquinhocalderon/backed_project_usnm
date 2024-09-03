import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateModuloDto {         


    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo nombre_modulo no debe estar vacío' })
    @IsString({ message: 'El campo nombre_modulo tiene que ser una cadena de caracteres' })
    @MaxLength(16 , {message: 'El campo nombre_modulo debe 16 caracteres como maximo'})
    @MinLength(2 , {message: 'El campo nombre_modulo debe 2 caracteres como minimo'})
    nombre_modulo: string;

}
