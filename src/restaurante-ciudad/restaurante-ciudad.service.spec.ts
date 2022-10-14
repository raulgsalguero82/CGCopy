import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteCiudadModule } from './restaurante-ciudad.module';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

describe('RestauranteCiudadService', () => {
  let service: RestauranteCiudadService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];
  let storedRestaurante: RestauranteEntity;

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();
    ciudadesList = [];

    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = {
        nombre: faker.address.cityName(),
        id: '',
        restaurantes: [],
      };

      ciudadesList.push(await ciudadRepository.save(ciudad));
    }

    const restaurante: RestauranteEntity = {
      nombre: faker.company.name(),
      id: '',
      estrellasMichelin: 'NINGUNA',
      fechaDeConsecucion: faker.date.birthdate(),
    };

    storedRestaurante = await restauranteRepository.save(restaurante);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, RestauranteCiudadModule],
      providers: [
        RestauranteCiudadService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestauranteCiudadService>(RestauranteCiudadService);

    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Asociar ciudad inexistente a restaurante', async () => {
    await expect(() =>
      service.associateCiudadRestaurante('0', storedRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      `La ciudad con id 0 no se ha encontrado`,
    );
  });

  it('Asociar ciudad a restaurante inexistente', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() =>
      service.associateCiudadRestaurante(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Asociar ciudad a restaurante', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];

    const restaurante: RestauranteEntity =
      await service.associateCiudadRestaurante(ciudad.id, storedRestaurante.id);

    expect(restaurante.ciudad.id).toBe(ciudad.id);
  });

  it('Obtener un listado de restaurantes para una ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];

    await service.associateCiudadRestaurante(ciudad.id, storedRestaurante.id);

    const restaurantes: RestauranteEntity[] =
      await service.findRestaurantesByCiudad(ciudad.id);

    expect(restaurantes.length).toBe(1);
  });

  it('Obtener un listado de restaurantes para una ciudad que no existe', async () => {
    await expect(() =>
      service.findRestaurantesByCiudad('0'),
    ).rejects.toHaveProperty(
      'message',
      `La ciudad con id 0 no se ha encontrado`,
    );
  });
});
