import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import {
  generateCulturaGastronomica,
  generateRestaurante,
} from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturagastronomicaRestauranteController } from './culturagastronomica-restaurante.controller';
import { CulturagastronomicaRestauranteModule } from './culturagastronomica-restaurante.module';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CulturagastronomicaRestauranteController', () => {
  let controller: CulturagastronomicaRestauranteController;
  let culturagastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturagastronomicaList: CulturaGastronomicaEntity[];
  let restauranteList: RestauranteEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    culturagastronomicaRepository.clear();
    restauranteRepository.clear();
    culturagastronomicaList = [];
    restauranteList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturaGastronomicaEntity =
        await culturagastronomicaRepository.save(generateCulturaGastronomica());
      culturagastronomicaList.push(culturagastronomica);
    }

    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save(
        generateRestaurante(),
      );
      restauranteList.push(restaurante);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturagastronomicaRestauranteModule],
      controllers: [CulturagastronomicaRestauranteController],
      providers: [
        CulturagastronomicaRestauranteService,
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

    controller = module.get<CulturagastronomicaRestauranteController>(
      CulturagastronomicaRestauranteController,
    );

    culturagastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Associate Restaurant to culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const restaurante: RestauranteEntity = restauranteList[0];

    const resp = await controller.addCulturagastronomicaRestaurante(
      cultura.id,
      restaurante.id,
    );

    expect(resp.restaurantes[0].id).toBe(restaurante.id);
  });

  it('Associate invalid restaurant', async () => {
    await expect(() =>
      controller.addCulturagastronomicaRestaurante(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Associate invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.addCulturagastronomicaRestaurante('0', restauranteList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Remove Restaurant from culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const restaurante: RestauranteEntity = restauranteList[0];

    let resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaRestaurante(
        cultura.id,
        restaurante.id,
      );

    expect(resp.restaurantes[0].id).toBe(restaurante.id);

    resp = await controller.deleteCulturagastronomicaRestaurante(
      cultura.id,
      restaurante.id,
    );

    expect(resp.restaurantes.length).toBe(0);
  });

  it('Remove invalid restaurant', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRestaurante(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Remove invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRestaurante(
        '0',
        restauranteList[0].id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('find restaurantes by culturagastronomica', async () => {
    jest.spyOn(cache, 'get');

    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const restaurante: RestauranteEntity = restauranteList[0];

    const resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaRestaurante(
        cultura.id,
        restaurante.id,
      );

    expect(resp.restaurantes[0].id).toBe(restaurante.id);

    const restaurantes = await controller.findRestaurantesByCulturagastronomica(
      cultura.id,
    );

    expect(restaurantes.length).toBe(1);
  });

  it('find invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.findRestaurantesByCulturagastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });
});
