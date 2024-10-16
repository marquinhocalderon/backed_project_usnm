import { Gabinentes } from "src/gabinetes/entities/gabinete.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "backups"})
export class Backups {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true })
    estado: boolean;



}
