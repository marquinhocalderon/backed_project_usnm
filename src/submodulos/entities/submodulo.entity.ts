import { Modulo } from "src/modulos/entities/modulo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// NOMBRE DE LA TABLA EN LA BASE DE DATOS
@Entity({name: "submodulos"})
export class SubModulo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    nombre_submodulo: string;

    @Column({default: true})
    estado: boolean;

    @ManyToOne(() => Modulo, (modulo) => modulo.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    @JoinColumn({name: "id_modulo"})
    modulos: Modulo


}
