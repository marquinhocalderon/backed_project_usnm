import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "facultades"})
export class Facultade {


        
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    facultad: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_usuario"})
    usuarios: Usuario



}
