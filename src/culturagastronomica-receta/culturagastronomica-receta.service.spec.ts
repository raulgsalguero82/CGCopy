import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaRecetaService } from './culturagastronomica-receta.service';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  generateCulturaGastronomica,
  generateReceta,
} from '../shared/test-utils/generators';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { CulturaGastronomicaRecetaModule } from './culturagastronomica-receta.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturagastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let recetasRepository: Repository<RecetaEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetasList: RecetaEntity[];
  let storedCulturaGastronomica: CulturaGastronomicaEntity;

  const seedDatabase = async () => {
    recetasRepository.clear();
    culturaGastronomicaRepository.clear();
    recetasList = [];

    for (let i = 0; i < 5; i++) {
      recetasList.push(await recetasRepository.save(generateReceta()));
    }

    storedCulturaGastronomica = await culturaGastronomicaRepository.save(
      generateCulturaGastronomica(),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaRecetaModule],
      providers: [
        CulturaGastronomicaRecetaService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(
      CulturaGastronomicaRecetaService,
    );

    recetasRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Relación creada satisfactoriamente', async () => {
    const receta = recetasList[0];

    const culturaGastronomica = await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    expect(culturaGastronomica.recetas[0].nombre).toBe(receta.nombre);
    expect(culturaGastronomica.recetas[0].id).toBe(receta.id);
    expect(culturaGastronomica.recetas[0].descripcion).toBe(receta.descripcion);
  });

  it('Crear relación falla por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const receta = recetasList[0];

    await expect(() =>
      service.addRecetaCulturaGastronomica(culturaGastronomicaId, receta.id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Crear relación falla por receta inexistente', async () => {
    const recetaId = faker.database.mongodbObjectId();

    await expect(() =>
      service.addRecetaCulturaGastronomica(
        storedCulturaGastronomica.id,
        recetaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${recetaId} no se ha encontrado`,
    );
  });

  it('Retorna recetas(vacío) de cultura gastronómica', async () => {
    const recetas = await service.findRecetasByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(recetas.length).toBe(0);
  });

  it('Retorna recetas de cultura gastronómica', async () => {
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    const recetas = await service.findRecetasByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(recetas.length).toBe(1);

    expect(recetas[0].nombre).toBe(receta.nombre);
    expect(recetas[0].id).toBe(receta.id);
    expect(recetas[0].descripcion).toBe(receta.descripcion);
  });

  it('Falla al retornar recetas por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    await expect(() =>
      service.findRecetasByCulturaGastronomicaId(culturaGastronomicaId),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Retorna receta de cultura gastronómica', async () => {
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    const recetaReornada =
      await service.findRecetaByCulturaGastronomicaIdByRecetaId(
        storedCulturaGastronomica.id,
        receta.id,
      );

    expect(recetaReornada.nombre).toBe(receta.nombre);
    expect(recetaReornada.id).toBe(receta.id);
    expect(recetaReornada.descripcion).toBe(receta.descripcion);
  });

  it('Falla al retornar receta por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdByRecetaId(
        culturaGastronomicaId,
        receta.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al retornar receta por receta inexistente', async () => {
    const recetaId = faker.database.mongodbObjectId();
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdByRecetaId(
        storedCulturaGastronomica.id,
        recetaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al retornar receta por receta no relacionada', async () => {
    const recetaId = recetasList[1].id;
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdByRecetaId(
        storedCulturaGastronomica.id,
        recetaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Relación múltiple creada satisfactoriamente', async () => {
    const culturaGastronomica =
      await service.associateRecetasCulturaGastronomica(
        storedCulturaGastronomica.id,
        recetasList,
      );

    expect(culturaGastronomica.recetas[0].nombre).toBe(recetasList[0].nombre);
    expect(culturaGastronomica.recetas[1].nombre).toBe(recetasList[1].nombre);
    expect(culturaGastronomica.recetas[2].nombre).toBe(recetasList[2].nombre);
    expect(culturaGastronomica.recetas[3].nombre).toBe(recetasList[3].nombre);
    expect(culturaGastronomica.recetas[4].nombre).toBe(recetasList[4].nombre);
  });

  it('Falla al crear relación múltiple por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await expect(() =>
      service.associateRecetasCulturaGastronomica(
        culturaGastronomicaId,
        recetasList,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al crear relación múltiple por receta inexistente', async () => {
    const newReceta = generateReceta();

    await expect(() =>
      service.associateRecetasCulturaGastronomica(
        storedCulturaGastronomica.id,
        [...recetasList, newReceta],
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${newReceta.id} no se ha encontrado`,
    );
  });

  it('Elimina receta de cultura gastronómica satisfactoriamente', async () => {
    const receta = recetasList[0];

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    const culturaGastronomica = await service.deleteRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    expect(culturaGastronomica.recetas.length).toBe(0);
  });

  it('Falla al eliminar receta de cultura gastronómica por cultura gastronómica inexistente', async () => {
    const receta = recetasList[0];
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    expect(() =>
      service.deleteRecetaCulturaGastronomica(culturaGastronomicaId, receta.id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al eliminar receta de cultura gastronómica por receta inexistente', async () => {
    const receta = recetasList[0];
    const recetaId = faker.database.mongodbObjectId();

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    expect(() =>
      service.deleteRecetaCulturaGastronomica(
        storedCulturaGastronomica.id,
        recetaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al eliminar receta de cultura gastronómica por receta no asociada', async () => {
    const receta = recetasList[0];
    const recetaId = recetasList[1].id;

    await service.addRecetaCulturaGastronomica(
      storedCulturaGastronomica.id,
      receta.id,
    );

    expect(() =>
      service.deleteRecetaCulturaGastronomica(
        storedCulturaGastronomica.id,
        recetaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${recetaId} no está asociada con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });
});
