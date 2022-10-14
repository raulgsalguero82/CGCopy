import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  historia: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  categoria: string;

  @Field(() => [CulturaGastronomicaEntity])
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.productos,
  )
  culturasGastronomicas?: CulturaGastronomicaEntity[];
}
