import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
  cacheKey = 'ciudades';

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // FIND ALL
  async findAll(): Promise<CiudadEntity[]> {
    let cached: CiudadEntity[] = await this.cacheManager.get<CiudadEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      cached = await this.ciudadRepository.find({
        relations: ['restaurantes', 'pais'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }
    return cached;
  }

  // FIND ONE
  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: {
        id,
      },
      relations: ['restaurantes', 'pais'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        `La ciudad con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return ciudad;
  }

  // CREATE
  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    return await this.ciudadRepository.save(ciudad);
  }

  // UPDATE
  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const ciudadById: CiudadEntity = await this.ciudadRepository.findOne({
      where: {
        id,
      },
    });

    if (!ciudadById) {
      throw new BusinessLogicException(
        `La ciudad con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    ciudad.id = id;

    return await this.ciudadRepository.save(ciudad);
  }

  // DELETE
  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        `La ciudad con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.ciudadRepository.remove(ciudad);
  }
}
