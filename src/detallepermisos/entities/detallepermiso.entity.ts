import { Modulo } from "src/modulos/entities/modulo.entity";
import { SubModulo } from "src/submodulos/entities/submodulo.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: "detallepermisos"})
export class Detallepermiso {

    @PrimaryGeneratedColumn()
    id: number;

      // nombre de la tabla como se llamara la relacion del campo
    @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;

      // nombre de la tabla como se llamara la relacion del campo
    @ManyToOne(() => SubModulo, (submodulo) => submodulo.id, { eager: true })
    @JoinColumn({ name: 'id_submodulo' })
    sub_modulo: SubModulo;

// esto son para poner dar permisos de si puede ver los datos , crear , actualizar y borrar
    @Column({default: false})
    create: boolean;
    @Column({default: false})
    read: boolean;

    @Column({default: false})
    update: boolean;

    @Column({default: false})
    delete: boolean;

    // y el habilitado sirve para poder habilitar segun el modulo que se le de permiso
    @Column({default: false})
    habilitado: boolean;


}
