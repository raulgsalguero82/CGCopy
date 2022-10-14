import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaPaisService } from './culturagastronomica-pais.service';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import {
  generateCulturaGastronomica,
  generatePais,
} from '../shared/test-utils/generators';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { CulturaGastronomicaPaisModule } from './culturagastronomica-pais.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/common';

describe('CulturaGastronomicaPaisService', () => {
  let service: CulturaGastronomicaPaisService;
  let paisesRepository: Repository<PaisEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisesList: PaisEntity[];
  let storedCulturaGastronomica: CulturaGastronomicaEntity;

  const seedDatabase = async () => {
    paisesRepository.clear();
    culturaGastronomicaRepository.clear();
    paisesList = [];

    for (let i = 0; i < 5; i++) {
      paisesList.push(await paisesRepository.save(generatePais()));
    }

    storedCulturaGastronomica = await culturaGastronomicaRepository.save(
      generateCulturaGastronomica(),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, CulturaGastronomicaPaisModule],
      providers: [
        CulturaGastronomicaPaisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CulturaGastronomicaPaisService>(
      CulturaGastronomicaPaisService,
    );

    paisesRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
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
    const pais = paisesList[0];

    const culturaGastronomica = await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(culturaGastronomica.paises[0].nombre).toBe(pais.nombre);
    expect(culturaGastronomica.paises[0].id).toBe(pais.id);
  });

  it('Crear relación falla por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const pais = paisesList[0];

    await expect(() =>
      service.addPaisCulturaGastronomica(culturaGastronomicaId, pais.id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Crear relación falla por Pais inexistente', async () => {
    const paisId = faker.database.mongodbObjectId();

    await expect(() =>
      service.addPaisCulturaGastronomica(storedCulturaGastronomica.id, paisId),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${paisId} no se ha encontrado`,
    );
  });

  it('Retorna paises(vacío) de cultura gastronómica', async () => {
    const paises = await service.findPaisesByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(paises.length).toBe(0);
  });

  it('Retorna paises de cultura gastronómica', async () => {
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    const paises = await service.findPaisesByCulturaGastronomicaId(
      storedCulturaGastronomica.id,
    );

    expect(paises.length).toBe(1);

    expect(paises[0].nombre).toBe(pais.nombre);
    expect(paises[0].id).toBe(pais.id);
  });

  it('Falla al retornar paises por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    await expect(() =>
      service.findPaisesByCulturaGastronomicaId(culturaGastronomicaId),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Retorna Pais de cultura gastronómica', async () => {
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    const paisReornada = await service.findPaisByCulturaGastronomicaIdByPaisId(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(paisReornada.nombre).toBe(pais.nombre);
    expect(paisReornada.id).toBe(pais.id);
  });

  it('Falla al retornar Pais por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    await expect(() =>
      service.findPaisByCulturaGastronomicaIdByPaisId(
        culturaGastronomicaId,
        pais.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al retornar Pais por pais inexistente', async () => {
    const paisId = faker.database.mongodbObjectId();
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    await expect(() =>
      service.findPaisByCulturaGastronomicaIdByPaisId(
        storedCulturaGastronomica.id,
        paisId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al retornar pais por pais no relacionada', async () => {
    const paisId = paisesList[1].id;
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    await expect(() =>
      service.findPaisByCulturaGastronomicaIdByPaisId(
        storedCulturaGastronomica.id,
        paisId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Relación múltiple creada satisfactoriamente', async () => {
    const culturaGastronomica =
      await service.associatePaisesCulturaGastronomica(
        storedCulturaGastronomica.id,
        paisesList,
      );

    expect(culturaGastronomica.paises[0].nombre).toBe(paisesList[0].nombre);
    expect(culturaGastronomica.paises[1].nombre).toBe(paisesList[1].nombre);
    expect(culturaGastronomica.paises[2].nombre).toBe(paisesList[2].nombre);
    expect(culturaGastronomica.paises[3].nombre).toBe(paisesList[3].nombre);
    expect(culturaGastronomica.paises[4].nombre).toBe(paisesList[4].nombre);
  });

  it('Falla al crear relación múltiple por cultura gastronómica inexistente', async () => {
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await expect(() =>
      service.associatePaisesCulturaGastronomica(
        culturaGastronomicaId,
        paisesList,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al crear relación múltiple por pais inexistente', async () => {
    const newpais = generatePais();

    await expect(() =>
      service.associatePaisesCulturaGastronomica(storedCulturaGastronomica.id, [
        ...paisesList,
        newpais,
      ]),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${newpais.id} no se ha encontrado`,
    );
  });

  it('Elimina Pais de cultura gastronómica satisfactoriamente', async () => {
    const pais = paisesList[0];

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    const culturaGastronomica = await service.deletePaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(culturaGastronomica.paises.length).toBe(0);
  });

  it('Falla al eliminar Pais de cultura gastronómica por cultura gastronómica inexistente', async () => {
    const pais = paisesList[0];
    const culturaGastronomicaId = faker.database.mongodbObjectId();

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(() =>
      service.deletePaisCulturaGastronomica(culturaGastronomicaId, pais.id),
    ).rejects.toHaveProperty(
      'message',
      `La cultura gastronómica con id ${culturaGastronomicaId} no se ha encontrado`,
    );
  });

  it('Falla al eliminar Pais de cultura gastronómica por pais inexistente', async () => {
    const pais = paisesList[0];
    const paisId = faker.database.mongodbObjectId();

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(() =>
      service.deletePaisCulturaGastronomica(
        storedCulturaGastronomica.id,
        paisId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });

  it('Falla al eliminar Pais de cultura gastronómica por Pais no asociada', async () => {
    const pais = paisesList[0];
    const paisId = paisesList[1].id;

    await service.addPaisCulturaGastronomica(
      storedCulturaGastronomica.id,
      pais.id,
    );

    expect(() =>
      service.deletePaisCulturaGastronomica(
        storedCulturaGastronomica.id,
        paisId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El pais con id ${paisId} no está asociado con la cultura gastronómica con id ${storedCulturaGastronomica.id}`,
    );
  });
});
