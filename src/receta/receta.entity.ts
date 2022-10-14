import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  urlFoto: string;

  @Field()
  @Column({ nullable: true })
  urlVideo: string;

  @Field()
  @Column({ type: 'text' })
  procesoDePreparacion: string;

  @Field(() => CulturaGastronomicaEntity, { nullable: true })
  @ManyToOne(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.recetas,
  )
  culturaGastronomica?: CulturaGastronomicaEntity;
}
