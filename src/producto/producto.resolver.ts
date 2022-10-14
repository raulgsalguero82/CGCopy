import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoService } from '../producto/producto.service';

@Resolver()
export class ProductoResolver {
  constructor(private productoService: ProductoService) {}

  @Query(() => [ProductoEntity])
  productos(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }
  @Query(() => ProductoEntity)
  producto(@Args('id') id: string): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }

  @Mutation(() => ProductoEntity)
  crearProducto(
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.create(producto);
  }

  @Mutation(() => ProductoEntity)
  actualizarProducto(
    @Args('id') id: string,
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.update(id, producto);
  }

  @Mutation(() => String)
  async borrarProducto(@Args('id') id: string): Promise<string> {
    await this.productoService.delete(id);
    return id;
  }
}
