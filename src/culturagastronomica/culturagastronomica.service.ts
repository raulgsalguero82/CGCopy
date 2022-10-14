import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturagastronomicaService {
  cacheKey = 'Culturagastronomica';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturagastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CulturaGastronomicaEntity[]> {
    let cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<
      CulturaGastronomicaEntity[]
    >(this.cacheKey);

    if (cached == null || cached == undefined) {
      cached = await this.culturagastronomicaRepository.find({
        relations: ['restaurantes', 'paises', 'recetas', 'productos'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  async findOne(id: string): Promise<CulturaGastronomicaEntity> {
    const culturagastronomica: CulturaGastronomicaEntity =
      await this.culturagastronomicaRepository.findOne({
        where: { id },
        relations: ['restaurantes', 'paises', 'recetas', 'productos'],
      });
    if (!culturagastronomica)
      throw new BusinessLogicException(
        'La culturagastronomica con el id ' + id + ' no se ha encontrado',
        BusinessError.NOT_FOUND,
      );

    return culturagastronomica;
  }

  async create(
    culturagastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    return await this.culturagastronomicaRepository.save(culturagastronomica);
  }

  async update(
    id: string,
    culturagastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    const persistedculturagastronomica: CulturaGastronomicaEntity =
      await this.culturagastronomicaRepository.findOne({ where: { id } });
    if (!persistedculturagastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con id ' + id + ' no se ha encontrado',
        BusinessError.NOT_FOUND,
      );

    culturagastronomica.id = id;

    return await this.culturagastronomicaRepository.save(culturagastronomica);
  }

  async delete(id: string) {
    const culturagastronomica: CulturaGastronomicaEntity =
      await this.culturagastronomicaRepository.findOne({ where: { id } });
    if (!culturagastronomica)
      throw new BusinessLogicException(
        'La culturagastronomica con el id ' + id + ' no se ha encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.culturagastronomicaRepository.remove(culturagastronomica);
  }
}
