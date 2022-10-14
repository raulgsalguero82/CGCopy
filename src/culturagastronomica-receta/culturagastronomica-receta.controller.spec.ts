import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import {
  generateCulturaGastronomica,
  generateReceta,
} from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturagastronomicaRecetaController } from '../culturagastronomica-receta/culturagastronomica-receta.controller';
import { CulturaGastronomicaRecetaModule } from '../culturagastronomica-receta/culturagastronomica-receta.module';
import { CulturaGastronomicaRecetaService } from '../culturagastronomica-receta/culturagastronomica-receta.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturagastronomicaRecetaController', () => {
  let controller: CulturagastronomicaRecetaController;
  let culturagastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let culturagastronomicaList: CulturaGastronomicaEntity[];
  let recetasList: RecetaEntity[];

  const seedDatabase = async () => {
    culturagastronomicaRepository.clear();
    recetaRepository.clear();
    culturagastronomicaList = [];
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const culturagastronomica: CulturaGastronomicaEntity =
        await culturagastronomicaRepository.save(generateCulturaGastronomica());
      culturagastronomicaList.push(culturagastronomica);
    }

    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save(
        generateReceta(),
      );
      recetasList.push(receta);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaRecetaModule],
      controllers: [CulturagastronomicaRecetaController],
      providers: [
        CulturaGastronomicaRecetaService,
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

    controller = module.get<CulturagastronomicaRecetaController>(
      CulturagastronomicaRecetaController,
    );

    culturagastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    await seedDatabase();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Associate Receta to culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const receta: RecetaEntity = recetasList[0];

    const resp = await controller.addCulturagastronomicaReceta(
      cultura.id,
      receta.id,
    );

    expect(resp.recetas[0].id).toBe(receta.id);
  });

  it('Associate invalid receta', async () => {
    await expect(() =>
      controller.addCulturagastronomicaReceta(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id 0 no se ha encontrado`,
    );
  });

  it('Associate invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.addCulturagastronomicaReceta('0', recetasList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('Remove Receta from culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const receta: RecetaEntity = recetasList[0];

    let resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaReceta(cultura.id, receta.id);

    expect(resp.recetas[0].id).toBe(receta.id);

    resp = await controller.deleteCulturagastronomicaRceta(
      cultura.id,
      receta.id,
    );

    expect(resp.recetas.length).toBe(0);
  });

  it('Remove invalid receta', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRceta(
        culturagastronomicaList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id 0 no está asociada con la cultura gastronómica con id ${culturagastronomicaList[0].id}`,
    );
  });

  it('Remove invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRceta('0', recetasList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });

  it('find recetas by culturagastronomica', async () => {
    const cultura: CulturaGastronomicaEntity = culturagastronomicaList[0];
    const receta: RecetaEntity = recetasList[0];

    const resp: CulturaGastronomicaEntity =
      await controller.addCulturagastronomicaReceta(cultura.id, receta.id);

    expect(resp.recetas[0].id).toBe(receta.id);

    const recetas = await controller.findRecetaByCulturagastronomica(
      cultura.id,
    );

    expect(recetas.length).toBe(1);
  });

  it('find invalid cultura gastronomica', async () => {
    await expect(() =>
      controller.findRecetaByCulturagastronomica('0'),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id 0 no se ha encontrado`,
    );
  });
});
