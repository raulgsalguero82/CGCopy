import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisService {
  cacheKey = 'paises';

  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // FIND ALL
  async findAll(): Promise<PaisEntity[]> {
    let cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(
      this.cacheKey,
    );
    if (!cached) {
      cached = await this.paisRepository.find({
        relations: ['ciudades'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }
    return cached;
  }

  // FIND ONE
  async findOne(id: string): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: {
        id,
      },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    if (!pais) {
      throw new BusinessLogicException(
        `El pais con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return pais;
  }

  // CREATE
  async create(pais: PaisEntity): Promise<PaisEntity> {
    return await this.paisRepository.save(pais);
  }

  // UPDATE
  async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
    const paisById: PaisEntity = await this.paisRepository.findOne({
      where: {
        id,
      },
    });

    if (!paisById) {
      throw new BusinessLogicException(
        `El pais con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    pais.id = id;

    return await this.paisRepository.save(pais);
  }

  // DELETE
  async delete(id: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });

    if (!pais) {
      throw new BusinessLogicException(
        `El pais con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.paisRepository.remove(pais);
  }

  async TODO()
  {
    //TODO
  }
}
