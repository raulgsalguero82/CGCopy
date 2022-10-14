import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaRecetaService {
  cacheKey = 'CulturagastronomicaReceta';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['recetas'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: `${recetaId}` },
    });
    if (!receta) {
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findRecetasByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<RecetaEntity[]> {
    let cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(
      this.cacheKey,
    );

    if (cached == null || cached == undefined) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['recetas'],
        });

      if (!culturaGastronomica) {
        throw new BusinessLogicException(
          `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }

      cached = culturaGastronomica.recetas;
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  async findRecetaByCulturaGastronomicaIdByRecetaId(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['recetas'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const receta: RecetaEntity = culturaGastronomica.recetas.find(
      (_receta) => _receta.id === recetaId,
    );
    if (!receta) {
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return receta;
  }

  async associateRecetasCulturaGastronomica(
    culturaGastronomicaId: string,
    recetas: RecetaEntity[],
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['recetas'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    for (const receta of recetas) {
      const recetaValidada = await this.recetaRepository.findOne({
        where: { id: `${receta.id}` },
      });
      if (!recetaValidada) {
        throw new BusinessLogicException(
          `La receta con id ${receta.id} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    culturaGastronomica.recetas = [...culturaGastronomica.recetas, ...recetas];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['recetas'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const receta: RecetaEntity = culturaGastronomica.recetas.find(
      (_receta) => _receta.id === recetaId,
    );
    if (!receta) {
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    culturaGastronomica.recetas = culturaGastronomica.recetas.filter(
      (_receta) => _receta.id != recetaId,
    );
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
