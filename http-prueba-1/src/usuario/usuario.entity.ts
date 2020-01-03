import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario_web')
export class UsuarioEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_web',
    comment: 'Identificador de la tabla usuario',
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column(
    {
      type: 'varchar',
      name: 'nombre',
      nullable: true,
      comment: 'Nombre del usuario',
    })
  nombre?: string;

  @Index({
    unique: true,
  })
  @Column(
    {
      type: 'varchar',
      name: 'cedula',
      nullable: false,
      comment: 'Cédula del usuario',
    })
  cedula: string;
}