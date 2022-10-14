import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaProductoService } from './culturagastronomica-producto.service';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  generateCulturaGastronomica,
  generateProducto,
} from '../shared/test-utils/generators';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { CulturaGastronomicaProductoModule } from './culturagastronomica-producto.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let productosRepository: Repository<ProductoEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productosList: ProductoEntity[];
  let storedCulturaGastronomica: CulturaGastronomicaEntity;

  const seedDatabase = async () => {
    productosRepository.clear();
    culturaGastronomicaRepository.clear();
    productosList = [];

    for (let i = 0; i < 5; i++) {
      productosList.push(await productosRepository.save(generateProducto()));
    }

    storedCulturaGastronomica = await culturaGastronomicaRepository.save(
      generateCulturaGastronomica(),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaProductoModule],
      providers: [
        CulturaGastronomicaProductoService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(
      CulturaGastronomicaProductoService,
    );

    productosRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Relación creada satisfactoriamente', async () => {
    const producto = productosList[0];

    const culturaGastronomica = await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    expect(culturaGastronomica.productos[0].nombre).toBe(producto.nombre);
    expect(culturaGastronomica.productos[0].id).toBe(producto.id);
  });

  it('Crear relación falla por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const producto = productosList[0];

    await expect(() =>
      service.addProductoCulturaGastronomica(
        culturaGastronomicaId,
        producto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Crear relación falla por Producto inexistente', async () => {
    const productoId = faker.database.mongodbObjectId();

    await expect(() =>
      service.addProductoCulturaGastronomica(
        storedCulturaGastronomica.id,
        productoId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${productoId} no se ha encontrado`,
    );
  });

  it('Retorna productos(vacío) de cultura gastronómica', async () => {
    const productos = await service.findProductosByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(productos.length).toBe(0);
  });

  it('Retorna productos de cultura gastronómica', async () => {
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    const productos = await service.findProductosByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(productos.length).toBe(1);

    expect(productos[0].nombre).toBe(producto.nombre);
    expect(productos[0].id).toBe(producto.id);
  });

  it('Falla al retornar productos por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    await expect(() =>
      service.findProductosByCulturaGastronomicaId(culturaGastronomicaId),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al retornar Producto por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    await expect(() =>
      service.findProductoByCulturaGastronomicaId(
        culturaGastronomicaId,
        producto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al retornar Producto por producto inexistente', async () => {
    const productoId = faker.database.mongodbObjectId();
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    await expect(() =>
      service.findProductoByCulturaGastronomicaId(
        storedCulturaGastronomica.id,
        productoId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al retornar producto por producto no relacionada', async () => {
    const productoId = productosList[1].id;
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    await expect(() =>
      service.findProductoByCulturaGastronomicaId(
        storedCulturaGastronomica.id,
        productoId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Relación múltiple creada satisfactoriamente', async () => {
    const culturaGastronomica =
      await service.associateProductosCulturaGastronomica(
        storedCulturaGastronomica.id,
        productosList,
      );

    expect(culturaGastronomica.productos[0].nombre).toBe(
      productosList[0].nombre,
    );
    expect(culturaGastronomica.productos[1].nombre).toBe(
      productosList[1].nombre,
    );
    expect(culturaGastronomica.productos[2].nombre).toBe(
      productosList[2].nombre,
    );
    expect(culturaGastronomica.productos[3].nombre).toBe(
      productosList[3].nombre,
    );
    expect(culturaGastronomica.productos[4].nombre).toBe(
      productosList[4].nombre,
    );
  });

  it('Falla al crear relación múltiple por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await expect(() =>
      service.associateProductosCulturaGastronomica(
        culturaGastronomicaId,
        productosList,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al crear relación múltiple por producto inexistente', async () => {
    const newproducto = generateProducto();

    await expect(() =>
      service.associateProductosCulturaGastronomica(
        storedCulturaGastronomica.id,
        [...productosList, newproducto],
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${newproducto.id} no se ha encontrado`,
    );
  });

  it('Elimina Producto de cultura gastronómica satisfactoriamente', async () => {
    const producto = productosList[0];

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    const culturaGastronomica = await service.deleteProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    expect(culturaGastronomica.productos.length).toBe(0);
  });

  it('Falla al eliminar Producto de cultura gastronómica por cultura gastronómica inexistente', async () => {
    const producto = productosList[0];
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    expect(() =>
      service.deleteProductoCulturaGastronomica(
        culturaGastronomicaId,
        producto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al eliminar Producto de cultura gastronómica por producto inexistente', async () => {
    const producto = productosList[0];
    const productoId = faker.database.mongodbObjectId();

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    expect(() =>
      service.deleteProductoCulturaGastronomica(
        storedCulturaGastronomica.id,
        productoId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al eliminar Producto de cultura gastronómica por Producto no asociada', async () => {
    const producto = productosList[0];
    const productoId = productosList[1].id;

    await service.addProductoCulturaGastronomica(
      storedCulturaGastronomica.id,
      producto.id,
    );

    expect(() =>
      service.deleteProductoCulturaGastronomica(
        storedCulturaGastronomica.id,
        productoId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id ${productoId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });
});
