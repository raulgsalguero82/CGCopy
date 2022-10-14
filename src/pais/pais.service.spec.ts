import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { PaisModule } from './pais.module';
import { generatePais } from '../shared/test-utils/generators';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];

    for (let i = 0; i <= 10; i++) {
      const pais: PaisEntity = await repository.save(generatePais());

      paisesList.push(pais);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([PaisEntity]),
        PaisModule,
      ],
      providers: [
        PaisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaisService>(PaisService);

    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // FIND ALL
  it('findAll should return all paises', async () => {
    const spy = jest.spyOn(cache, 'get');

    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(paises).toHaveLength(paisesList.length);
  });

  // FIND ONE
  it('findOne should return pais by id', async () => {
    const id: string = faker.database.mongodbObjectId();
    const pais: PaisEntity = {
      id,
      nombre: faker.address.country(),
      ciudades: [],
    };

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const paisById: PaisEntity = await service.findOne(newPais.id);
    expect(paisById).not.toBeNull();
    expect(paisById.nombre).toEqual(newPais.nombre);
  });

  // FIND ONE INVALID PAIS ERROR
  it('should throw an exception for invalid Pais', async () => {
    const id: string = faker.database.mongodbObjectId();

    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `El pais con id ${id} no se ha encontrado`,
    );
  });

  // CREATE PAIS
  it('should create a new Pais', async () => {
    const id: string = faker.database.mongodbObjectId();
    const pais: PaisEntity = {
      id,
      nombre: faker.address.country(),
      ciudades: [],
    };

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const paisById: PaisEntity = await repository.findOne({
      where: { id: newPais.id },
    });
    expect(paisById).not.toBeNull();
    expect(paisById.nombre).toEqual(newPais.nombre);
  });

  // UPDATE PAIS
  it('should update Pais', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = 'New name';

    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
  });

  // UPDATE INVALID PAIS ERROR
  it('should throw an exception for invalid Pais', async () => {
    const id: string = faker.database.mongodbObjectId();
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais,
      nombre: 'New name',
    };
    await expect(() => service.update(id, pais)).rejects.toHaveProperty(
      'message',
      `El pais con id ${id} no se ha encontrado`,
    );
  });

  // DELETE PAIS
  it('should delete Pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    const deletedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletedPais).toBeNull();
  });

  // DELETE PAIS INVALID PAIS ERROR
  it('should delete Pais', async () => {
    const id: string = faker.database.mongodbObjectId();
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    await expect(() => service.delete(id)).rejects.toHaveProperty(
      'message',
      `El pais con id ${id} no se ha encontrado`,
    );
  });
});
