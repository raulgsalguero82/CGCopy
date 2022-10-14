import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generateCiudad } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { CiudadController } from './ciudad.controller';
import { CiudadEntity } from './ciudad.entity';
import { CiudadModule } from './ciudad.module';
import { CiudadService } from './ciudad.service';
import { CiudadDto } from './ciudad.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('ciudadController', () => {
  let controller: CiudadController;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save(generateCiudad());
      ciudadList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([CiudadEntity]),
        CiudadModule,
      ],
      controllers: [CiudadController],
      providers: [
        CiudadService,
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

    controller = module.get<CiudadController>(CiudadController);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all ciudades', async () => {
    const spy = jest.spyOn(cache, 'get');
    const result = await controller.findAll();
    expect(spy).toHaveBeenCalled();
    expect(result.length).toBe(ciudadList.length);
  });

  it('Should return 1 item', async () => {
    const ciudad: CiudadEntity = ciudadList[0];

    const result: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });

    expect((await controller.findOne(ciudad.id)).id).toBe(result.id);
  });

  it('Should fail returning 1 ciudad', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create Ciudad', async () => {
    const ciudad: CiudadDto = generateCiudad();

    expect(await controller.create(ciudad)).toMatchObject(ciudad);
  });

  it('Delete Ciudad failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update Ciudad', async () => {
    const toBeUpdated: CiudadDto = {
      nombre: 'Bogota',
    };

    expect(
      await controller.update(ciudadList[0].id, toBeUpdated),
    ).toHaveProperty('nombre', 'Bogota');
  });

  it('Update invalid Ciudad', async () => {
    const toBeUpdated: CiudadDto = {
      nombre: 'Bogota',
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty(
      'message',
      `La ciudad con id 0 no se ha encontrado`,
    );
  });
});
