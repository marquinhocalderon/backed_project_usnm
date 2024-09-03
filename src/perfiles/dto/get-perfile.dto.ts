import { ApiProperty } from "@nestjs/swagger";



export class GetPerfilDto {   
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    nombre_perfil: string;

    @ApiProperty()
    estado: boolean;



}
