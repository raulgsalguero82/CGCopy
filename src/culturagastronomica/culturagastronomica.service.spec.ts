import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity as CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturagastronomicaModule } from './culturagastronomica.module';
import { generateCulturaGastronomica } from '../shared/test-utils/generators';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CulturagastronomicaService', () => {
  let service: CulturagastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturagastronomicaList: CulturaGastronomicaEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    culturagastronomicaList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturaGastronomicaEntity =
        await repository.save(generateCulturaGastronomica());
      culturagastronomicaList.push(culturagastronomica);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturagastronomicaModule],
      providers: [
        CulturagastronomicaService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturagastronomicaService>(
      CulturagastronomicaService,
    );
    repository = module.get<Repository<CulturaGastronomicaEntity>>(
      getRepositoryToken(CulturaGastronomicaEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all culturasgrastronomicas', async () => {
    const spy = jest.spyOn(cache, 'get');

    const culturasgrastronomicas: CulturaGastronomicaEntity[] =
      await service.findAll();
    expect(culturasgrastronomicas).not.toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(culturasgrastronomicas.length).toBe(culturagastronomicaList.length);
  });

  it('findOne should return a culturagastronomica by id', async () => {
    const storedCulturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];
    const culturagastronomica: CulturaGastronomicaEntity =
      await service.findOne(storedCulturagastronomica.id);
    expect(culturagastronomica).not.toBeNull();
    expect(culturagastronomica.nombre).toEqual(
      storedCulturagastronomica.nombre,
    );
    expect(culturagastronomica.descripcion).toEqual(
      storedCulturagastronomica.descripcion,
    );
  });

  it('findOne should throw an exception for an invalid culturagastronomica', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La culturagastronomica con el id 0 no se ha encontrado',
    );
  });

  it('create should return a new culturagastronomica', async () => {
    const culturagastronomica: CulturaGastronomicaEntity =
      generateCulturaGastronomica();

    const newCulturagastronomica: CulturaGastronomicaEntity =
      await service.create(culturagastronomica);
    expect(newCulturagastronomica).not.toBeNull();

    const storedCulturagastronomica: CulturaGastronomicaEntity =
      await repository.findOne({
        where: { id: newCulturagastronomica.id },
      });

    expect(storedCulturagastronomica).not.toBeNull();
    expect(storedCulturagastronomica.nombre).toEqual(
      newCulturagastronomica.nombre,
    );
    expect(storedCulturagastronomica.descripcion).toEqual(
      newCulturagastronomica.descripcion,
    );
  });

  it('update should modify a culturagastronomica', async () => {
    const culturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];
    culturagastronomica.nombre = 'New name';
    culturagastronomica.descripcion = 'New address';
    const updatedCulturagastronomica: CulturaGastronomicaEntity =
      await service.update(culturagastronomica.id, culturagastronomica);
    expect(updatedCulturagastronomica).not.toBeNull();
    const storedCulturagastronomica: CulturaGastronomicaEntity =
      await repository.findOne({
        where: { id: culturagastronomica.id },
      });
    expect(storedCulturagastronomica).not.toBeNull();
    expect(storedCulturagastronomica.nombre).toEqual(
      culturagastronomica.nombre,
    );
    expect(storedCulturagastronomica.descripcion).toEqual(
      culturagastronomica.descripcion,
    );
  });

  it('update should throw an exception for an invalid culturagastronomica', async () => {
    let culturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];
    culturagastronomica = {
      ...culturagastronomica,
      nombre: 'New name',
      descripcion: 'New address',
    };
    await expect(() =>
      service.update('0', culturagastronomica),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con id 0 no se ha encontrado',
    );
  });

  it('delete should remove a culturagastronomica', async () => {
    const culturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];
    await service.delete(culturagastronomica.id);
    const deletedculturagastronomica: CulturaGastronomicaEntity =
      await repository.findOne({
        where: { id: culturagastronomica.id },
      });
    expect(deletedculturagastronomica).toBeNull();
  });

  it('delete should throw an exception for an invalid culturagastronomica', async () => {
    const culturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];
    await service.delete(culturagastronomica.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La culturagastronomica con el id 0 no se ha encontrado',
    );
  });
});
