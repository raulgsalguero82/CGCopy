import { RecetaEntity } from '../receta/receta.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(() => [RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.culturaGastronomica)
  recetas: RecetaEntity[];

  @Field(() => [PaisEntity])
  @ManyToMany(() => PaisEntity, (pais) => pais.culturasGastronomicas)
  @JoinTable()
  paises: PaisEntity[];

  @Field(() => [RestauranteEntity])
  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.culturasGastronomicas,
  )
  @JoinTable()
  restaurantes: RestauranteEntity[];

  @Field(() => [ProductoEntity])
  @ManyToMany(
    () => ProductoEntity,
    (producto) => producto.culturasGastronomicas,
  )
  @JoinTable()
  productos: ProductoEntity[];
}
