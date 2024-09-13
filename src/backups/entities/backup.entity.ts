import { Gabinentes } from "src/gabinetes/entities/gabinete.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "backups"})
export class Backups {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    backup1: string;
    
    @Column()
    backup2: string;

    @Column()
    backup3: string;

    
    @ManyToOne(() => Gabinentes, (gabinetes) => gabinetes.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_gabinete"})
    gabinetes: Gabinentes

    @ManyToOne(() => Usuario, (usuario) => usuario.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })
    //   Nombre de la relacio de la tabla
    @JoinColumn({name: "id_usuario"})
    usuarios: Usuario



}
