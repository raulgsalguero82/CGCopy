import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { ProductoModule } from './producto.module';

import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];

    for (let i = 0; i <= 10; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: 'Producto' + faker.lorem.sentence(),
        historia: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        categoria: 'FRUTA',
      });

      productosList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([ProductoEntity]),
        ProductoModule,
      ],
      providers: [
        ProductoService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);

    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);
    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // FIND ALL
  it('findAll should return all productoes', async () => {
    const spy = jest.spyOn(cache, 'get');
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(productos.length).toBe(productosList.length);
  });

  // FIND ONE
  it('findOne should return producto by id', async () => {
    const id: string = faker.database.mongodbObjectId();
    const producto: ProductoEntity = {
      id,
      nombre: 'New producto',
      historia: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      categoria: 'FRUTA',
    };

    const newproducto: ProductoEntity = await service.create(producto);
    expect(newproducto).not.toBeNull();

    const productoById: ProductoEntity = await service.findOne(newproducto.id);
    expect(productoById).not.toBeNull();
    expect(productoById.nombre).toEqual(newproducto.nombre);
  });

  // FIND ONE INVALID producto ERROR
  it('should throw an exception for invalid producto', async () => {
    const id: string = faker.database.mongodbObjectId();

    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `El producto con id ${id} no se ha encontrado`,
    );
  });

  // CREATE producto
  it('should create a new producto', async () => {
    const id: string = faker.database.mongodbObjectId();
    const producto: ProductoEntity = {
      id,
      nombre: 'New producto',
      historia: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      categoria: 'FRUTA',
    };

    const newproducto: ProductoEntity = await service.create(producto);
    expect(newproducto).not.toBeNull();

    const productoById: ProductoEntity = await service.findOne(newproducto.id);
    expect(productoById).not.toBeNull();
    expect(productoById.nombre).toEqual(newproducto.nombre);
  });

  // UPDATE producto
  it('should update producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';

    const updatedproducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedproducto).not.toBeNull();

    const storedproducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedproducto).not.toBeNull();
    expect(storedproducto.nombre).toEqual(producto.nombre);
  });

  // UPDATE INVALID producto ERROR
  it('should throw an exception for invalid producto', async () => {
    const id: string = faker.database.mongodbObjectId();
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
    };
    await expect(() => service.update(id, producto)).rejects.toHaveProperty(
      'message',
      `El producto con id ${id} no se ha encontrado`,
    );
  });

  // DELETE producto
  it('should delete producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    const deletedproducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedproducto).toBeNull();
  });

  // DELETE producto INVALID producto ERROR
  it('should delete producto', async () => {
    const id: string = faker.database.mongodbObjectId();
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete(id)).rejects.toHaveProperty(
      'message',
      `El producto con id ${id} no se ha encontrado`,
    );
  });
});
