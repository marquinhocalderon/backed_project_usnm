import { Facultade } from "src/facultades/entities/facultade.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "gabinetes"})
export class Gabinentes {


        
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_gabinete: string;


    @Column('text')
    descripcion_referencia: string;
    


    @Column({nullable: true})
    imagen_url_1: string;

    @Column({nullable: true})
    imagen_url_2: string;

    @Column({nullable: true})
    imagen_url_3: string;


    @ManyToOne(() => Facultade, (facultad) => facultad.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_facultad"})
    facultades: Facultade


    
    @ManyToOne(() => Usuario, (usuario) => usuario.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_usuario"})
    usuarios: Usuario

    @Column({default: true})
    estado: boolean;





}
