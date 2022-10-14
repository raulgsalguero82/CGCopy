import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Resolver()
export class RecetaResolver {
  constructor(private recetaService: RecetaService) {}

  @Query(() => [RecetaEntity])
  recetas(): Promise<RecetaEntity[]> {
    return this.recetaService.findAll();
  }
  @Query(() => RecetaEntity)
  receta(@Args('id') id: string): Promise<RecetaEntity> {
    return this.recetaService.findOne(id);
  }

  @Mutation(() => RecetaEntity)
  crearReceta(@Args('receta') recetaDto: RecetaDto): Promise<RecetaEntity> {
    const restaurante = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.create(restaurante);
  }

  @Mutation(() => RecetaEntity)
  actualizarReceta(
    @Args('id') id: string,
    @Args('receta') recetaDto: RecetaDto,
  ): Promise<RecetaEntity> {
    const restaurante = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.update(id, restaurante);
  }

  @Mutation(() => String)
  async borrarReceta(@Args('id') id: string): Promise<string> {
    await this.recetaService.delete(id);
    return id;
  }
}
