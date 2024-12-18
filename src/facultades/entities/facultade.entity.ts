import { Gabinentes } from "src/gabinetes/entities/gabinete.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "facultades"})
export class Facultade {


        
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    facultad: string;

    @Column({nullable: true})
    imagen: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_usuario"})
    usuarios: Usuario

    @Column({ default: true })
    estado: boolean;

  
    @OneToMany(() => Gabinentes, (gabinete) => gabinete.facultades, { cascade: true })
    gabinetes: Gabinentes[];

}
