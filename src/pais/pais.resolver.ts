import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Resolver()
export class PaisResolver {
  constructor(private paisService: PaisService) {}

  @Query(() => [PaisEntity])
  paises(): Promise<PaisEntity[]> {
    return this.paisService.findAll();
  }

  @Query(() => PaisEntity)
  pais(@Args('id') id: string): Promise<PaisEntity> {
    return this.paisService.findOne(id);
  }

  @Mutation(() => PaisEntity)
  createPais(@Args('pais') paisDto: PaisDto): Promise<PaisEntity> {
    const Pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.create(Pais);
  }

  @Mutation(() => PaisEntity)
  updatePais(
    @Args('id') id: string,
    @Args('pais') paisDto: PaisDto,
  ): Promise<PaisEntity> {
    const Pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.update(id, Pais);
  }

  @Mutation(() => String)
  async deletePais(@Args('id') id: string): Promise<string> {
    await this.paisService.delete(id);
    return id;
  }
}
