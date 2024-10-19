import { Backups } from 'src/backups/entities/backup.entity';
import { Gabinentes } from 'src/gabinetes/entities/gabinete.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'detallebackups' })
export class DetalleBackups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  fecha: Date;

  @Column({ nullable: true, type: 'json' })
  backups_json: string;


  @ManyToOne(() => Gabinentes, (gabinetes) => gabinetes.id, {
    // cascade: true,
    eager: true, // para que traiga todos los datos de la columna relacionada
  })
  //   Nombre de la relacio de la tabla
  @JoinColumn({ name: 'id_gabinete' })
  gabinetes: Gabinentes;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, {
    // cascade: true,
    eager: true, // para que traiga todos los datos de la columna relacionada
  })
  //   Nombre de la relacio de la tabla
  @JoinColumn({ name: 'id_usuario' })
  usuarios: Usuario;

  @ManyToOne(() => Backups, (backup) => backup.id, {
    // cascade: true,
    eager: true, // para que traiga todos los datos de la columna relacionada
  })
  //   Nombre de la relacio de la tabla
  @JoinColumn({ name: 'id_backup' })
  backups: Backups;


  @Column({ default: true })
  estado: boolean;

}
