import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaProductoService {
  cacheKey = 'CulturagastronomicaProducto';

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async addProductoCulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['productos'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        `El producto con id ${productoId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    culturaGastronomica.productos = [
      ...culturaGastronomica.productos,
      producto,
    ];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findProductosByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<ProductoEntity[]> {
    let cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);

    if (cached == null || cached == undefined) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: culturaGastronomicaId },
          relations: ['productos'],
        });

      if (!culturaGastronomica) {
        throw new BusinessLogicException(
          `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }

      cached = culturaGastronomica.productos;
      await this.cacheManager.set(this.cacheKey, cached);
    }

    return cached;
  }

  async findProductoByCulturaGastronomicaId(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const producto: ProductoEntity = culturaGastronomica.productos.find(
      (_producto) => _producto.id === productoId,
    );
    if (!producto) {
      throw new BusinessLogicException(
        `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return producto;
  }

  async associateProductosCulturaGastronomica(
    culturaGastronomicaId: string,
    productos: ProductoEntity[],
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${culturaGastronomicaId}` },
        relations: ['productos'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    for (const producto of productos) {
      const productoValidado = await this.productoRepository.findOne({
        where: { id: `${producto.id}` },
      });
      if (!productoValidado) {
        throw new BusinessLogicException(
          `El producto con id ${producto.id} no se ha encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    culturaGastronomica.productos = [
      ...culturaGastronomica.productos,
      ...productos,
    ];
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteProductoCulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
        BusinessError.NOT_FOUND,
      );
    }

    const producto: ProductoEntity = culturaGastronomica.productos.find(
      (_producto) => _producto.id === productoId,
    );
    if (!producto) {
      throw new BusinessLogicException(
        `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${culturaGastronomicaId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    culturaGastronomica.productos = culturaGastronomica.productos.filter(
      (_producto) => _producto.id != productoId,
    );
    return this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
