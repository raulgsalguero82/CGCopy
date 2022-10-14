import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CiudadEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(() => [RestauranteEntity])
  @OneToMany(() => RestauranteEntity, (restaurante) => restaurante.ciudad)
  restaurantes: RestauranteEntity[];

  @Field(() => PaisEntity)
  @ManyToOne(() => PaisEntity, (pais) => pais.ciudades)
  pais?: PaisEntity;
}
