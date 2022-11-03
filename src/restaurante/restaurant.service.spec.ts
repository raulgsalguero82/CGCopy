import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { RestauranteModule } from './restaurante.module';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];

    for (let i = 0; i <= 10; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: 'Restaurant ' + faker.address.country(),
        estrellasMichelin: 'NINGUNA',
        fechaDeConsecucion: faker.date.birthdate(),
      });

      restaurantesList.push(restaurante);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([RestauranteEntity]),
        RestauranteModule,
      ],
      providers: [
        RestauranteService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);

    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);
    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  /*
  // FIND ALL
  it('findAll should return all restaurantes', async () => {
    const spy = jest.spyOn(cache, 'get');
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(restaurantes.length).toBe(restaurantesList.length);
  });

  // FIND ONE
  it('findOne should return restaurant by id', async () => {
    const id: string = faker.database.mongodbObjectId();
    const restaurante: RestauranteEntity = {
      id,
      nombre: 'New name',
      estrellasMichelin: 'NINGUNA',
      fechaDeConsecucion: faker.date.birthdate(),
    };

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const restaurantById: RestauranteEntity = await service.findOne(
      newRestaurante.id,
    );

    expect(restaurantById).not.toBeNull();
    expect(restaurantById.nombre).toEqual(newRestaurante.nombre);
  });

  // FIND ONE INVALID Restaurant ERROR
  it('should throw an exception for invalid Restaurant', async () => {
    const id: string = faker.database.mongodbObjectId();

    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `El restaurante con id ${id} no se ha encontrado`,
    );
  });

  // CREATE Restaurant
  it('should create a new Restaurant', async () => {
    const id: string = faker.database.mongodbObjectId();
    const restaurante: RestauranteEntity = {
      id,
      nombre: 'New name',
      estrellasMichelin: 'NINGUNA',
      fechaDeConsecucion: faker.date.birthdate(),
    };

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const restaurantById: RestauranteEntity = await service.findOne(
      newRestaurante.id,
    );

    expect(restaurantById).not.toBeNull();
    expect(restaurantById.nombre).toEqual(newRestaurante.nombre);
  });

  // UPDATE Restaurant
  it('should update Restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = 'New name';

    const updatedRestaurante: RestauranteEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(updatedRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
  });

  // UPDATE INVALID Restaurant ERROR
  it('should throw an exception for invalid Restaurant', async () => {
    const id: string = faker.database.mongodbObjectId();
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante,
      nombre: 'New name',
    };

    await expect(() => service.update(id, restaurante)).rejects.toHaveProperty(
      'message',
      `El restaurante con id ${id} no se ha encontrado`,
    );
  });

  // DELETE Restaurant
  it('should delete Restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(deletedRestaurante).toBeNull();
  });

  // DELETE Restaurant INVALID Restaurant Restaurant
  it('should delete Restaurant', async () => {
    const id: string = faker.database.mongodbObjectId();
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);

    await expect(() => service.delete(id)).rejects.toHaveProperty(
      'message',
      `El restaurante con id ${id} no se ha encontrado`,
    );
  });*/
});
