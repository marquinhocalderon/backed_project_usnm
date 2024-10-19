import { DetalleBackups } from "src/detallebackups/entities/detallebackup.entity";
import { Gabinentes } from "src/gabinetes/entities/gabinete.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "backups"})
export class Backups {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true })
    estado: boolean;

     // Relación uno-a-muchos con DetalleBackups
  @OneToMany(() => DetalleBackups, (detalleBackup) => detalleBackup.backups)
  detallebackups: DetalleBackups[]; // Array de DetalleBackups


}
