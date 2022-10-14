import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import {
  generateCulturaGastronomica,
  generatePais,
} from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaPaisController } from './culturagastronomica-pais.controller';
import { CulturaGastronomicaPaisModule } from './culturagastronomica-pais.module';
import { CulturaGastronomicaPaisService } from './culturagastronomica-pais.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CulturaGastronomicaPaisController', () => {
  let controller: CulturaGastronomicaPaisController;
  let culturagastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let culturagastronomicaList: CulturaGastronomicaEntity[];
  let paisesList: PaisEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    culturagastronomicaRepository.clear();
    paisRepository.clear();
    culturagastronomicaList = [];
    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturaGastronomicaEntity =
        await culturagastronomicaRepository.save(generateCulturaGastronomica());
      culturagastronomicaList.push(culturagastronomica);
    }

    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save(generatePais());
      paisesList.push(pais);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaPaisModule],
      controllers: [CulturaGastronomicaPaisController],
      providers: [
        CulturaGastronomicaPaisService,
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

    controller = module.get<CulturaGastronomicaPaisController>(
      CulturaGastronomicaPaisController,
    );

    culturagastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    cache = module.get<Cache>(CACHE_MANAGER);
    await seedDatabase();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Associate Restaurant to culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const pais: PaisEntity = paisesList[0];

    const resp = await controller.addCulturagastronomicaPais(
      cultura.id,
      pais.id,
    );

    expect(resp.paises[0].id).toBe(pais.id);
  });

  it('Associate invalid restaurant', async () => {
    await expect(() =>
      controller.addCulturagastronomicaPais(culturagastronomicaList[0].id, '0'),
    ).rejects.toHaveProperty('message', `El pais con id 0 no se ha encontrado`);
  });

  it('Associate invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.addCulturagastronomicaPais('0', paisesList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Remove Restaurant from culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const pais: PaisEntity = paisesList[0];

    let resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaPais(cultura.id, pais.id);

    expect(resp.paises[0].id).toBe(pais.id);

    resp = await controller.deleteCulturagastronomicaPais(cultura.id, pais.id);

    expect(resp.paises.length).toBe(0);
  });

  it('Remove invalid restaurant', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaPais(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id 0 no está asociado con la cultura gastronómica con id ${culturagastronomicaList[0].id}`,
    );
  });

  it('Remove invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaPais('0', paisesList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('find paises by culturagastronomica', async () => {
    const spy = jest.spyOn(cache, 'get');

    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const pais: PaisEntity = paisesList[0];

    const resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaPais(cultura.id, pais.id);

    expect(resp.paises[0].id).toBe(pais.id);

    const paises = await controller.findpaisesByCulturagastronomica(cultura.id);

    expect(spy).toHaveBeenCalled();
    expect(paises.length).toBe(1);
  });

  it('find invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.findpaisesByCulturagastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });
});
