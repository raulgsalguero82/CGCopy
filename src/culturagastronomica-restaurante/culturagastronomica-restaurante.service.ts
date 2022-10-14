import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturagastronomicaRestauranteService {
  cacheKey = 'CulturagastronomicaRestaurante';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly recetaRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async associateRestauranteCulturaGastronomica(
    culturaGastronomicaId: string,
    restauranteId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['restaurantes'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const restaurante: RestauranteEntity = await this.recetaRepository.findOne({
      where: { id: `${restauranteId}` },
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        `El restaurante con id ${restauranteId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    culturaGastronomica.restaurantes = [
      ...culturaGastronomica.restaurantes,
      restaurante,
    ];

    const saved = await this.culturaGastronomicaRepository.save(
      culturaGastronomica,
    );

    return saved;
  }

  async deleteRestauranteCulturaGastronomica(
    culturaGastronomicaId: string,
    restauranteId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['restaurantes'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const restaurante: RestauranteEntity = await this.recetaRepository.findOne({
      where: { id: `${restauranteId}` },
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        `El restaurante con id ${restauranteId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    culturaGastronomica.restaurantes = culturaGastronomica.restaurantes.filter(
      (_restaurante) => _restaurante.id != restauranteId,
    );

    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async getRestauranteByCulturaGastronomica(
    culturaGastronomicaId: string,
  ): Promise<RestauranteEntity[]> {
    let cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(this.cacheKey);

    if (cached == null || cached == undefined) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: `${culturaGastronomicaId}` },
          relations: ['restaurantes'],
        });
      if (!culturaGastronomica) {
        throw new BusinessLogicException(
          `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
      cached = culturaGastronomica.restaurantes;
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }
}
