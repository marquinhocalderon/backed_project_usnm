import { Modulo } from "src/modulos/entities/modulo.entity";
import { SubModulo } from "src/submodulos/entities/submodulo.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: "detallepermisos"})
export class Detallepermiso {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

    @ManyToOne(() => SubModulo, (submodulo) => submodulo.id, { eager: true })
    @JoinColumn({ name: 'id_submodulo' })
    sub_modulo: SubModulo;


    @Column({default: false})
    create: boolean;
    @Column({default: false})
    read: boolean;

    @Column({default: false})
    update: boolean;

    @Column({default: false})
    delete: boolean;

    @Column({default: false})
    habilitado: boolean;


}
