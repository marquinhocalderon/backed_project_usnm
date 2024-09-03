import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// NOMBRE DE LA TABLA EN LA BASE DE DATOS
@Entity({name: "modulos"})
export class Modulo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    nombre_modulo: string;

    @Column({default: true})
    estado: boolean;


}
