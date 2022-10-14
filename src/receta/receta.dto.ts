import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecetaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly urlFoto: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  readonly urlVideo: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly procesoDePreparacion: string;
}
