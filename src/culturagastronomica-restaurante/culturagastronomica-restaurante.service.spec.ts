import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { CulturagastronomicaRestauranteModule } from './culturagastronomica-restaurante.module';
import {
  generateCulturaGastronomica,
  generateRestaurante,
} from '../shared/test-utils/generators';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturagastronomicaRestauranteService', () => {
  let service: CulturagastronomicaRestauranteService;
  let restaurantesRepository: Repository<RestauranteEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurantesList: RestauranteEntity[];
  let storedCulturaGastronomica: CulturaGastronomicaEntity;

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    restaurantesRepository.clear();
    restaurantesList = [];

    for (let i = 0; i < 5; i++) {
      restaurantesList.push(
        await restaurantesRepository.save(generateRestaurante()),
      );
    }

    storedCulturaGastronomica = await culturaGastronomicaRepository.save(
      generateCulturaGastronomica(),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturagastronomicaRestauranteModule],
      providers: [
        CulturagastronomicaRestauranteService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturagastronomicaRestauranteService>(
      CulturagastronomicaRestauranteService,
    );

    restaurantesRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Asociar restaurante a culturagastronomica', async () => {
    const nuevaCultura: CulturaGastronomicaEntity =
      await service.associateRestauranteCulturaGastronomica(
        storedCulturaGastronomica.id,
        restaurantesList[0].id,
      );

    expect(nuevaCultura.restaurantes[0].id).toBe(restaurantesList[0].id);
  });

  it('Borrar restaurante de culturagastronomica', async () => {
    await culturaGastronomicaRepository.save(generateCulturaGastronomica());

    let nuevaCultura: CulturaGastronomicaEntity =
      await service.associateRestauranteCulturaGastronomica(
        storedCulturaGastronomica.id,
        restaurantesList[0].id,
      );

    expect(nuevaCultura.restaurantes[0].id).toBe(restaurantesList[0].id);

    nuevaCultura = await service.deleteRestauranteCulturaGastronomica(
      nuevaCultura.id,
      restaurantesList[0].id,
    );
    expect(nuevaCultura.restaurantes.length).toBe(0);
  });

  it('Fallo al borrar un restaurante de una culturagastronomica que no existe', async () => {
    await expect(() =>
      service.deleteRestauranteCulturaGastronomica('0', '0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Fallo al borrar un restaurante que no existe', async () => {
    await expect(() =>
      service.deleteRestauranteCulturaGastronomica(
        storedCulturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Fallo al asociar un restaurante que no existe', async () => {
    expect(async () =>
      service.associateRestauranteCulturaGastronomica(
        storedCulturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Fallo al asociar una cultura que no existe', async () => {
    expect(async () =>
      service.associateRestauranteCulturaGastronomica(
        '0',
        restaurantesList[0].id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Fallo al recuperar restaurantes de una culturagastronomica que no existe', async () => {
    expect(async () =>
      service.getRestauranteByCulturaGastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Fallo al recuperar restaurantes de una culturagastronomica que no existe', async () => {
    expect(async () =>
      service.getRestauranteByCulturaGastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Recuperar restaurantes de una culturagastronomica', async () => {
    await service.associateRestauranteCulturaGastronomica(
      storedCulturaGastronomica.id,
      restaurantesList[0].id,
    );

    const restaurantes = await service.getRestauranteByCulturaGastronomica(
      storedCulturaGastronomica.id,
    );

    expect(restaurantes.length).toBe(1);
  });

  it('Traer CulturaGastronomica correctamente', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await service.findCulturaGastronomica(storedCulturaGastronomica.id);

    expect(culturaGastronomica.id).toBe(storedCulturaGastronomica.id);
  });
  it('Fallo en traer CulturaGastronomica', () => {
    expect(async () =>
      service.findCulturaGastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Traer Restaurante correctamente', async () => {
    const restaurante: RestauranteEntity = await service.findRestaurante(
      restaurantesList[0].id,
    );

    expect(restaurante.id).toBe(restaurantesList[0].id);
  });
  it('Fallo en traer Restaurante', () => {
    expect(async () => service.findRestaurante('0')).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });
});
