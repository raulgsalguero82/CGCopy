import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaPaisService {
  cacheKey = 'CulturagastronomicaPais';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addPaisCulturaGastronomica(
    culturaGastronomicaId: string,
    paisId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['paises'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        `El pais con id ${paisId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    culturaGastronomica.paises = [...culturaGastronomica.paises, pais];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findPaisesByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<PaisEntity[]> {
    let cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(
      this.cacheKey,
    );
    if (cached == null || cached == undefined) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['paises'],
        });
      if (!culturaGastronomica) {
        throw new BusinessLogicException(
          `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
      cached = culturaGastronomica.paises;
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  async findPaisByCulturaGastronomicaIdByPaisId(
    culturaGastronomicaId: string,
    paisId: string,
  ): Promise<PaisEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['paises'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const pais: PaisEntity = culturaGastronomica.paises.find(
      (_pais) => _pais.id === paisId,
    );
    if (!pais) {
      throw new BusinessLogicException(
        `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return pais;
  }

  async associatePaisesCulturaGastronomica(
    culturaGastronomicaId: string,
    paises: PaisEntity[],
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['paises'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    for (const pais of paises) {
      const paisValidado = await this.paisRepository.findOne({
        where: { id: `${pais.id}` },
      });
      if (!paisValidado) {
        throw new BusinessLogicException(
          `El pais con id ${pais.id} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    culturaGastronomica.paises = [...culturaGastronomica.paises, ...paises];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deletePaisCulturaGastronomica(
    culturaGastronomicaId: string,
    paisId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['paises'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const pais: PaisEntity = culturaGastronomica.paises.find(
      (_pais) => _pais.id === paisId,
    );
    if (!pais) {
      throw new BusinessLogicException(
        `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    culturaGastronomica.paises = culturaGastronomica.paises.filter(
      (_pais) => _pais.id != paisId,
    );
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
