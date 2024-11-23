import { DetalleBackups } from "src/detallebackups/entities/detallebackup.entity";
import { Facultade } from "src/facultades/entities/facultade.entity";
import { Gabinentes } from "src/gabinetes/entities/gabinete.entity";
import { Perfile } from "src/perfiles/entities/perfile.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "usuarios"})
export class Usuario {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;


    @Column()
    nombre_completo: string;


    @Column()
    password: string;

    // @Column()
    // imagen: string;

    @Column({default: true})
    estado: boolean;


    @ManyToOne(() => Perfile, (perfil) => perfil.id, {
        // cascade: true,
        eager: true, // para que traiga todos los datos de la columna relacionada
      })

      // nombre de la tabla como se llamara la relacion del campo
    @JoinColumn({name: "id_perfil"})
    perfiles: Perfile

    @OneToMany(() => DetalleBackups, (detalleBackup) => detalleBackup.usuarios, { cascade: true })
    detalleBackups: DetalleBackups[];
  
    @OneToMany(() => Gabinentes, (gabinete) => gabinete.usuarios, { cascade: true })
    gabinetes: Gabinentes[];
  
    @OneToMany(() => Facultade, (facultade) => facultade.usuarios, { cascade: true })
    facultades: Facultade[];

 

}
