import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';

@Resolver()
export class CulturagastronomicaResolver {
  constructor(private culturagastronomicaService: CulturagastronomicaService) {}

  @Query(() => [CulturaGastronomicaEntity])
  culturasgastronomicas(): Promise<CulturaGastronomicaEntity[]> {
    return this.culturagastronomicaService.findAll();
  }

  @Query(() => CulturaGastronomicaEntity)
  culturagastronomica(
    @Args('id') id: string,
  ): Promise<CulturaGastronomicaEntity> {
    return this.culturagastronomicaService.findOne(id);
  }

  @Mutation(() => CulturaGastronomicaEntity)
  crearCulturagastronomica(
    @Args('culturagastronomica') culturagastronomicaDto: CulturagastronomicaDto,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica = plainToInstance(
      CulturaGastronomicaEntity,
      culturagastronomicaDto,
    );
    return this.culturagastronomicaService.create(culturaGastronomica);
  }

  @Mutation(() => CulturaGastronomicaEntity)
  actualizarCulturagastronomica(
    @Args('id') id: string,
    @Args('culturagastronomica') culturagastronomicaDto: CulturagastronomicaDto,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica = plainToInstance(
      CulturaGastronomicaEntity,
      culturagastronomicaDto,
    );
    return this.culturagastronomicaService.update(id, culturaGastronomica);
  }

  @Mutation(() => String)
  async borrarCulturagastronomica(@Args('id') id: string): Promise<string> {
    await this.culturagastronomicaService.delete(id);
    return id;
  }
}
