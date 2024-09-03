import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// NOMBRE DE LA TABLA EN LA BASE DE DATOS
@Entity({name: "perfiles"})
export class Perfile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    nombre_perfil: string;

    @Column({default: true})
    estado: boolean;

}
