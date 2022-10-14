import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductoDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  readonly historia: string;

  @Field()
  @IsString()
  readonly descripcion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly categoria: string;
}
