import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateBackupDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'El id_usuario no debe estar vacío' })
    @IsString({ message: "el campo id_usuario DEBE MANDARSE EN STRING" })
    @MinLength(1, { message: 'El campo id_usuario debe 1 caracteres como minimo' })
    id_usuario: string


    
    @ApiProperty()
    @IsNotEmpty({ message: 'El id_gabinete no debe estar vacío' })
    @IsString({ message: "el campo id_gabinete DEBE MANDARSE EN STRING" })
    @MinLength(1, { message: 'El campo id_gabinete debe 1 caracteres como minimo' })
    id_gabinete: string
}
