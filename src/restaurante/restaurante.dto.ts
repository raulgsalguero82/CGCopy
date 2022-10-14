import { Field, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { EstrellasMichelinType } from './restaurante.entity';

@InputType()
export class RestauranteDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsEnum(EstrellasMichelinType)
  @IsOptional()
  readonly estrellasMichelin: string;

  @Field()
  @IsDateString()
  @ValidateIf((object) => {
    return (
      !!object.estrellasMichelin &&
      object.estrellasMichelin != EstrellasMichelinType.NINGUNA
    );
  })
  readonly fechaDeConsecucion: Date;
}
