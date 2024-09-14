import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFacultadeDto {
    @ApiProperty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) // Trim whitespaces at the beginning and end
    @IsNotEmpty({ message: 'El campo facultad no debe estar vacío' })
    @IsString({ message: 'El campo facultad tiene que ser una cadena de caracteres' })
    @MaxLength(100, { message: 'El campo facultad debe 100 caracteres como maximo' })
    @MinLength(4, { message: 'El campo facultad debe 4 caracteres como minimo' })
    facultad: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'El id_usuario no debe estar vacío' })
    @IsString({ message: "el campo id_usuario DEBE MANDARSE EN STRING" })
    @MaxLength(100, { message: 'El campo id_usuario debe 100 caracteres como maximo' })
    @MinLength(1, { message: 'El campo id_usuario debe 1 caracteres como minimo' })
    id_usuario: string

}
