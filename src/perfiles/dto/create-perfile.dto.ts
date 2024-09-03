import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreatePerfileDto {         

    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo nombre_perfil no debe estar vacío' })
    @IsString({ message: 'El campo nombre_perfil tiene que ser una cadena de caracteres' })
    @MaxLength(16 , {message: 'El campo nombre_perfil debe 16 caracteres como maximo'})
    @MinLength(2 , {message: 'El campo nombre_perfil debe 2 caracteres como minimo'})
    nombre_perfil: string;

}
