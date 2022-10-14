import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { RecetaModule } from './receta.module';
import { generateReceta } from '../shared/test-utils/generators';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];

    for (let i = 0; i <= 10; i++) {
      recetasList.push(await repository.save(generateReceta()));
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, RecetaModule],
      providers: [
        RecetaService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecetaService>(RecetaService);

    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);
    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // FIND ALL
  it('findAll should return all recetas', async () => {
    const spy = jest.spyOn(cache, 'get');
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(recetas.length).toBe(recetasList.length);
  });

  // FIND ONE
  it('findOne should return receta by id', async () => {
    const id: string = faker.database.mongodbObjectId();
    const receta: RecetaEntity = { ...generateReceta(), id };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const recetaById: RecetaEntity = await service.findOne(newReceta.id);
    expect(recetaById).not.toBeNull();
    expect(recetaById.nombre).toEqual(newReceta.nombre);
  });

  // FIND ONE INVALID RECETA ERROR
  it('should throw an exception for invalid Receta', async () => {
    const id: string = faker.database.mongodbObjectId();

    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `La receta con id ${id} no se ha encontrado`,
    );
  });

  // CREATE RECETA
  it('should create a new Receta', async () => {
    const id: string = faker.database.mongodbObjectId();
    const receta: RecetaEntity = { ...generateReceta(), id };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const recetaById: RecetaEntity = await repository.findOne({
      where: { id: `${newReceta.id}` },
    });
    expect(recetaById).not.toBeNull();
    expect(recetaById.nombre).toEqual(newReceta.nombre);
  });

  // UPDATE RECETA
  it('should update Receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = 'New name';

    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
  });

  // UPDATE INVALID RECETA ERROR
  it('should throw an exception for invalid Receta', async () => {
    const id: string = faker.database.mongodbObjectId();
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta,
      nombre: 'New name',
    };
    await expect(() => service.update(id, receta)).rejects.toHaveProperty(
      'message',
      `La receta con id ${id} no se ha encontrado`,
    );
  });

  // DELETE RECETA
  it('should delete Receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(deletedReceta).toBeNull();
  });

  // DELETE RECETA INVALID RECETA ERROR
  it('should delete Receta', async () => {
    const id: string = faker.database.mongodbObjectId();
    await expect(() => service.delete(id)).rejects.toHaveProperty(
      'message',
      `La receta con id ${id} no se ha encontrado`,
    );
  });
});
