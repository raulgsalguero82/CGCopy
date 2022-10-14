import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Field, ObjectType } from '@nestjs/graphql';

export enum EstrellasMichelinType {
  NINGUNA = 'NINGUNA',
  UNA = 'UNA',
  DOS = 'DOS',
  TRES = 'TRES',
}

@ObjectType()
@Entity()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column({
    default: EstrellasMichelinType.NINGUNA,
  })
  estrellasMichelin: string;

  @Field()
  @Column({
    nullable: true,
  })
  fechaDeConsecucion: Date;

  @Field(() => CiudadEntity)
  @ManyToOne(() => CiudadEntity, (ciudad) => ciudad.restaurantes)
  ciudad?: CiudadEntity;

  @Field(() => [CulturaGastronomicaEntity])
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturagastronomica) => culturagastronomica.restaurantes,
  )
  culturasGastronomicas?: CulturaGastronomicaEntity[];
}
