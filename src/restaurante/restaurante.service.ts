import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EstrellasMichelinType, RestauranteEntity } from './restaurante.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteService {
  cacheKey = 'Restaurante';

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // FIND ALL
  async findAll(): Promise<RestauranteEntity[]> {
    let cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(this.cacheKey);
    if (cached == null || cached == undefined) {
      cached = await this.restauranteRepository.find({
        relations: ['culturasGastronomicas', 'ciudad'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  // FIND ONE
  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurant: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: {
          id,
        },
        relations: ['culturasGastronomicas', 'ciudad'],
      });
    if (!restaurant) {
      throw new BusinessLogicException(
        `El restaurante con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  // CREATE
  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {

    switch(restaurante.estrellasMichelin){
      case EstrellasMichelinType.NINGUNA:
      {break;}
      case EstrellasMichelinType.UNA:
      {break;}
      case EstrellasMichelinType.DOS:
      {break;}
      case EstrellasMichelinType.TRES:
      {break;}
    }


    if(restaurante.estrellasMichelin!=EstrellasMichelinType.NINGUNA && restaurante.estrellasMichelin!=EstrellasMichelinType.UNA && restaurante.estrellasMichelin!=EstrellasMichelinType.DOS && restaurante.estrellasMichelin!=EstrellasMichelinType.TRES )
    {
      throw new BusinessLogicException(
        `Formato invalido`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return this.restauranteRepository.save(restaurante);
  }

  // UPDATE
  async update(
    id: string,
    restaurante: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    const restauranteById: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: {
          id,
        },
      });

    if (!restauranteById) {
      throw new BusinessLogicException(
        `El restaurante con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    switch(restaurante.estrellasMichelin){
      case EstrellasMichelinType.NINGUNA:
      {break;}
      case EstrellasMichelinType.UNA:
      {break;}
      case EstrellasMichelinType.DOS:
      {break;}
      case EstrellasMichelinType.TRES:
      {break;}
    }

    if(restaurante.estrellasMichelin!=EstrellasMichelinType.NINGUNA && restaurante.estrellasMichelin!=EstrellasMichelinType.UNA && restaurante.estrellasMichelin!=EstrellasMichelinType.DOS && restaurante.estrellasMichelin!=EstrellasMichelinType.TRES )
    {
      throw new BusinessLogicException(
        `Formato invalido`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    restaurante.id = id;

    return this.restauranteRepository.save(restaurante);
  }

  // DELETE
  async delete(id: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id },
      });

    if (!restaurante) {
      throw new BusinessLogicException(
        `El restaurante con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.restauranteRepository.remove(restaurante);
  }

  async TODO()
  {
    //TODO
  }
}
