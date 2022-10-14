import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(() => [CiudadEntity])
  @OneToMany(() => CiudadEntity, (ciudad) => ciudad.pais)
  ciudades?: CiudadEntity[];

  @Field(() => [CulturaGastronomicaEntity], { nullable: true })
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.paises,
  )
  culturasGastronomicas?: CulturaGastronomicaEntity[];
}
