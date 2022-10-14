import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';
@Injectable()
export class RestauranteCiudadService {
  cacheKey = 'RestauranteCiudad';

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteEntityRepository: Repository<RestauranteEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async associateCiudadRestaurante(ciudadId: string, restauranteId: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteEntityRepository.findOne({
        where: { id: `${restauranteId}` },
      });

    if (!restaurante) {
      throw new BusinessLogicException(
        `El restaurante con id ${restauranteId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${ciudadId}` },
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        `La ciudad con id ${ciudadId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    restaurante.ciudad = ciudad;
    return this.restauranteEntityRepository.save(restaurante);
  }

  async findRestaurantesByCiudad(
    ciudadId: string,
  ): Promise<RestauranteEntity[]> {
    let cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(this.cacheKey);

    if (cached == null || cached == undefined) {
      const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
        where: { id: `${ciudadId}` },
        relations: ['restaurantes'],
      });

      if (!ciudad) {
        throw new BusinessLogicException(
          `La ciudad con id ${ciudadId} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }

      cached = ciudad.restaurantes;
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  async deleteCiudadRestaurante(ciudadId: string, restauranteId: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteEntityRepository.findOne({
        where: { id: `${restauranteId}` },
      });

    if (!restaurante) {
      throw new BusinessLogicException(
        `El restaurante con id ${restauranteId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: `${ciudadId}` },
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        `La ciudad con id ${ciudadId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    restaurante.ciudad = null;
    return this.restauranteEntityRepository.save(restaurante);
  }

  async TODO()
  {
    //TODO
  }
}
