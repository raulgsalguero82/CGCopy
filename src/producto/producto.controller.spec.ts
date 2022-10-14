import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generateProducto } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { ProductoController } from './producto.controller';
import { ProductoEntity } from './producto.entity';
import { ProductoModule } from './producto.module';
import { ProductoService } from './producto.service';
import { ProductoDto } from './producto.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('productoController', () => {
  let controller: ProductoController;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save(
        generateProducto(),
      );
      productoList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([ProductoEntity]),
        ProductoModule,
      ],
      controllers: [ProductoController],
      providers: [
        ProductoService,
        JwtService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all productos', async () => {
    const spy = jest.spyOn(cache, 'get');
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  });

  it('Should return 1 item', async () => {
    const producto: ProductoEntity = productoList[0];

    const result: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });

    expect((await controller.findOne(producto.id)).id).toBe(result.id);
  });

  it('Should fail returning 1 producto', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create Producto', async () => {
    const producto: ProductoDto = generateProducto();

    expect(await controller.create(producto)).toMatchObject(producto);
  });

  it('Delete Producto failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update Producto', async () => {
    const toBeUpdated: ProductoDto = {
      nombre: 'Sal de mar',
      historia: 'historia',
      descripcion: 'descripcion',
      categoria: 'CONDIMENTO',
    };

    expect(
      await controller.update(productoList[0].id, toBeUpdated),
    ).toHaveProperty('nombre', 'Sal de mar');
  });

  it('Update invalid Producto', async () => {
    const toBeUpdated: ProductoDto = {
      nombre: 'Sal de mar',
      historia: 'historia',
      descripcion: 'descripcion',
      categoria: 'CONDIMENTO',
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id 0 no se ha encontrado`,
    );
  });
});
