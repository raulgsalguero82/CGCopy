import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductoService {
  cacheKey = 'Producto';

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // FIND ALL
  async findAll(): Promise<ProductoEntity[]> {
    let cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);

    if (cached == null || cached == undefined) {
      cached = await this.productoRepository.find({
        relations: ['culturasGastronomicas'],
      });
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  // FIND ONE
  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: {
        id,
      },
      relations: ['culturasGastronomicas'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        `El producto con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return producto;
  }

  // CREATE
  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoRepository.save(producto);
  }

  // UPDATE
  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const productoById: ProductoEntity = await this.productoRepository.findOne({
      where: {
        id,
      },
    });

    if (!productoById) {
      throw new BusinessLogicException(
        `El producto con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    producto.id = id;

    return await this.productoRepository.save(producto);
  }

  // DELETE
  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new BusinessLogicException(
        `El producto con id ${id} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.productoRepository.remove(producto);
  }

  async TODO()
  {
    //TODO
  }
}
