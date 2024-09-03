import { ApiProperty } from "@nestjs/swagger";

export class GetUsuarioDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    username: string;

    @ApiProperty()
    nombre_completo: string;
    //@ApiProperty()
    //imagen: string;
    @ApiProperty()
    perfiles: any;
}