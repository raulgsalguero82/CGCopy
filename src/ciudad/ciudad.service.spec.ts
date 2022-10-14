import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { CiudadModule } from './ciudad.module';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];

    for (let i = 0; i <= 10; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.address.country(),
      });

      ciudadesList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([CiudadEntity]),
        CiudadModule,
      ],
      providers: [
        CiudadService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CiudadService>(CiudadService);

    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // FIND ALL
  it('findAll should return all ciudades', async () => {
    const spy = jest.spyOn(cache, 'get');

    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  // FIND ONE
  it('findOne should return ciudad by id', async () => {
    const id: string = faker.database.mongodbObjectId();
    const ciudad: CiudadEntity = {
      id,
      restaurantes: [],
      nombre: faker.address.city(),
    };

    const newciudad: CiudadEntity = await service.create(ciudad);
    expect(newciudad).not.toBeNull();

    const ciudadById: CiudadEntity = await service.findOne(newciudad.id);
    expect(ciudadById).not.toBeNull();
    expect(ciudadById.nombre).toEqual(newciudad.nombre);
  });

  // FIND ONE INVALID ciudad ERROR
  it('should throw an exception for invalid ciudad', async () => {
    const id: string = faker.database.mongodbObjectId();

    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `La ciudad con id ${id} no se ha encontrado`,
    );
  });

  // CREATE ciudad
  it('should create a new ciudad', async () => {
    const id: string = faker.database.mongodbObjectId();
    const ciudad: CiudadEntity = {
      id,
      nombre: faker.address.country(),
      restaurantes: [],
    };

    const newciudad: CiudadEntity = await service.create(ciudad);
    expect(newciudad).not.toBeNull();

    const ciudadById: CiudadEntity = await repository.findOne({
      where: { id: newciudad.id },
    });
    expect(ciudadById).not.toBeNull();
    expect(ciudadById.nombre).toEqual(newciudad.nombre);
  });

  // UPDATE ciudad
  it('should update ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = 'New name';

    const updatedciudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedciudad).not.toBeNull();

    const storedciudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedciudad).not.toBeNull();
    expect(storedciudad.nombre).toEqual(ciudad.nombre);
  });

  // UPDATE INVALID ciudad ERROR
  it('should throw an exception for invalid ciudad', async () => {
    const id: string = faker.database.mongodbObjectId();
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad,
      nombre: 'New name',
    };
    await expect(() => service.update(id, ciudad)).rejects.toHaveProperty(
      'message',
      `La ciudad con id ${id} no se ha encontrado`,
    );
  });

  // DELETE ciudad
  it('should delete ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    const deletedciudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedciudad).toBeNull();
  });

  // DELETE ciudad INVALID ciudad ERROR
  it('should delete ciudad', async () => {
    const id: string = faker.database.mongodbObjectId();
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete(id)).rejects.toHaveProperty(
      'message',
      `La ciudad con id ${id} no se ha encontrado`,
    );
  });
});
