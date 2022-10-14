import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import {
  generateCulturaGastronomica,
  generateProducto,
} from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaGastronomicaProductoController } from './culturagastronomica-producto.controller';
import { CulturaGastronomicaProductoModule } from './culturagastronomica-producto.module';
import { CulturaGastronomicaProductoService } from './culturagastronomica-producto.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturaGastronomicaProductoController', () => {
  let controller: CulturaGastronomicaProductoController;
  let culturagastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let culturagastronomicaList: CulturaGastronomicaEntity[];
  let productosList: ProductoEntity[];

  const seedDatabase = async () => {
    culturagastronomicaRepository.clear();
    productoRepository.clear();
    culturagastronomicaList = [];
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturaGastronomicaEntity =
        await culturagastronomicaRepository.save(generateCulturaGastronomica());
      culturagastronomicaList.push(culturagastronomica);
    }

    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save(
        generateProducto(),
      );
      productosList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaProductoModule],
      controllers: [CulturaGastronomicaProductoController],
      providers: [
        CulturaGastronomicaProductoService,
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

    controller = module.get<CulturaGastronomicaProductoController>(
      CulturaGastronomicaProductoController,
    );

    culturagastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Associate Producto to culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const producto: ProductoEntity = productosList[0];

    const resp = await controller.addCulturagastronomicaProducto(
      cultura.id,
      producto.id,
    );

    expect(resp.productos[0].id).toBe(producto.id);
  });

  it('Associate invalid producto', async () => {
    await expect(() =>
      controller.addCulturagastronomicaProducto(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id 0 no se ha encontrado`,
    );
  });

  it('Associate invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.addCulturagastronomicaProducto('0', productosList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Remove Producto from culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const producto: ProductoEntity = productosList[0];

    let resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaProducto(cultura.id, producto.id);

    expect(resp.productos[0].id).toBe(producto.id);

    resp = await controller.deleteCulturagastronomicaProducto(
      cultura.id,
      producto.id,
    );

    expect(resp.productos.length).toBe(0);
  });

  it('Remove invalid producto', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaProducto(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El producto con id 0 no está asociado con la cultura gastronómica con id ${culturagastronomicaList[0].id}`,
    );
  });

  it('Remove invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaProducto('0', productosList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('find productos by culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const producto: ProductoEntity = productosList[0];

    const resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaProducto(cultura.id, producto.id);

    expect(resp.productos[0].id).toBe(producto.id);

    const productos = await controller.findproductosByCulturagastronomica(
      cultura.id,
    );

    expect(productos.length).toBe(1);
  });

  it('find invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.findproductosByCulturagastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });
});
