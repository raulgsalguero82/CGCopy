import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generateCulturaGastronomica } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CulturagastronomicaController } from './culturagastronomica.controller';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaModule } from './culturagastronomica.module';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CulturagastronomicaController', () => {
  let controller: CulturagastronomicaController;
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
      controllers: [CulturagastronomicaController],
      providers: [
        CulturagastronomicaService,
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

    controller = module.get<CulturagastronomicaController>(
      CulturagastronomicaController,
    );
    repository = module.get<Repository<CulturaGastronomicaEntity>>(
      getRepositoryToken(CulturaGastronomicaEntity),
    );
    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all items', async () => {
    const spy = jest.spyOn(cache, 'get');

    const result = await controller.findAll();

    expect(spy).toHaveBeenCalled();
    expect(result.length).toBe(culturagastronomicaList.length);
  });

  it('Should return 1 item', async () => {
    const culturagastronomica: CulturaGastronomicaEntity =
      culturagastronomicaList[0];

    const result: CulturaGastronomicaEntity = await repository.findOne({
      where: { id: culturagastronomica.id },
    });

    expect((await controller.findOne(culturagastronomica.id)).id).toBe(
      result.id,
    );
  });

  it('Should fail returning 1 item', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create entity', async () => {
    const culturagastronomica: CulturagastronomicaDto =
      generateCulturaGastronomica();

    expect(await controller.create(culturagastronomica)).toMatchObject(
      culturagastronomica,
    );
  });

  it('Delete entity failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update entity', async () => {
    const toBeUpdated: CulturagastronomicaDto = {
      nombre: 'TestMe',
      descripcion: 'TestMeToo',
    };

    expect(
      await controller.update(culturagastronomicaList[0].id, toBeUpdated),
    ).toHaveProperty('nombre', 'TestMe');
  });

  it('Update invalid entity', async () => {
    const toBeUpdated: CulturagastronomicaDto = {
      nombre: 'TestMe',
      descripcion: 'TestMeToo',
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });
});
