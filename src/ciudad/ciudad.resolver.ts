import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Resolver()
export class CiudadResolver {
  constructor(private ciudadService: CiudadService) {}

  @Query(() => [CiudadEntity])
  ciudades(): Promise<CiudadEntity[]> {
    return this.ciudadService.findAll();
  }

  @Query(() => CiudadEntity)
  ciudad(@Args('id') id: string): Promise<CiudadEntity> {
    return this.ciudadService.findOne(id);
  }

  @Mutation(() => CiudadEntity)
  createCiudad(@Args('ciudad') ciudadDto: CiudadDto): Promise<CiudadEntity> {
    const ciudad = plainToInstance(CiudadEntity, ciudadDto);
    return this.ciudadService.create(ciudad);
  }

  @Mutation(() => CiudadEntity)
  updateCiudad(
    @Args('id') id: string,
    @Args('ciudad') ciudadDto: CiudadDto,
  ): Promise<CiudadEntity> {
    const ciudad = plainToInstance(CiudadEntity, ciudadDto);
    return this.ciudadService.update(id, ciudad);
  }

  @Mutation(() => String)
  async deleteCiudad(@Args('id') id: string): Promise<string> {
    await this.ciudadService.delete(id);
    return id;
  }
}
