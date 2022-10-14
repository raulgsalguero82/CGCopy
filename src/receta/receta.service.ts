import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {
  cacheKey = 'Receta';

  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // FIND ALL
  async findAll(): Promise<RecetaEntity[]> {
    let cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(
      this.cacheKey,
    );

    if (cached == null || cached == undefined) {
      cached = await this.recetaRepository.find({
        relations: ['culturaGastronomica'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  // FIND ONE
  async findOne(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: {
        id,
      },
      relations: ['culturaGastronomica'],
    });
    if (!receta) {
      throw new BusinessLogicException(
        `La receta con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    return receta;
  }

  // CREATE
  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return this.recetaRepository.save(receta);
  }

  // UPDATE
  async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
    const recetaById: RecetaEntity = await this.recetaRepository.findOne({
      where: {
        id,
      },
    });

    if (!recetaById) {
      throw new BusinessLogicException(
        `La receta con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    receta.id = id;

    return this.recetaRepository.save(receta);
  }

  // DELETE
  async delete(id: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });

    if (!receta) {
      throw new BusinessLogicException(
        `La receta con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.recetaRepository.remove(receta);
  }
}
