import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generatePais } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { PaisController } from './pais.controller';
import { PaisEntity } from './pais.entity';
import { PaisModule } from './pais.module';
import { PaisService } from './pais.service';
import { PaisDto } from './pais.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('PaisController', () => {
  let controller: PaisController;
  let repository: Repository<PaisEntity>;
  let paisList: PaisEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    paisList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save(generatePais());
      paisList.push(pais);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([PaisEntity]),
        PaisModule,
      ],
      controllers: [PaisController],
      providers: [
        PaisService,
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

    controller = module.get<PaisController>(PaisController);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all Paises', async () => {
    const spy = jest.spyOn(cache, 'get');

    const result = await controller.findAll();

    expect(spy).toHaveBeenCalled();
    expect(result.length).toBe(paisList.length);
  });

  it('Should return 1 pais', async () => {
    const pais: PaisEntity = paisList[0];

    const result: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });

    expect((await controller.findOne(pais.id)).id).toBe(result.id);
  });

  it('Should fail returning 1 pais', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create Pais', async () => {
    const pais: PaisDto = generatePais();

    expect(await controller.create(pais)).toMatchObject(pais);
  });

  it('Delete Pais failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update Pais', async () => {
    const toBeUpdated: PaisDto = {
      nombre: 'Pais test',
    };

    expect(await controller.update(paisList[0].id, toBeUpdated)).toHaveProperty(
      'nombre',
      'Pais test',
    );
  });

  it('Update invalid Pais', async () => {
    const toBeUpdated: PaisDto = {
      nombre: 'Pais test',
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty('message', `El pais con id 0 no se ha encontrado`);
  });
});
