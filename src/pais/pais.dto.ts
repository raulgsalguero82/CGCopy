import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PaisDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
