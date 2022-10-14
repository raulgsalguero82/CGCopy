import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generateRestaurante } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { RestauranteController } from '../restaurante/restaurante.controller';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteModule } from '../restaurante/restaurante.module';
import { RestauranteService } from '../restaurante/restaurante.service';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { faker } from '@faker-js/faker';

describe('RestauranteController', () => {
  let controller: RestauranteController;
  let repository: Repository<RestauranteEntity>;
  let restautranteList: RestauranteEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    restautranteList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save(
        generateRestaurante(),
      );
      restautranteList.push(restaurante);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([RestauranteEntity]),
        RestauranteModule,
      ],
      controllers: [RestauranteController],
      providers: [
        RestauranteService,
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

    controller = module.get<RestauranteController>(RestauranteController);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all restaurantes', async () => {
    const spy = jest.spyOn(cache, 'get');
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  });

  it('Should return 1 item', async () => {
    const restaurante: RestauranteEntity = restautranteList[0];

    const result: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });

    expect((await controller.findOne(restaurante.id)).id).toBe(result.id);
  });

  it('Should fail returning 1 restaurante', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create Restaurante', async () => {
    const restaurante: RestauranteDto = generateRestaurante();

    expect(await controller.create(restaurante)).toMatchObject(restaurante);
  });

  it('Delete Restaurante failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update Restaurante', async () => {
    const toBeUpdated: RestauranteDto = {
      nombre: 'Restaurant RRR',
      estrellasMichelin: 'NINGUNA',
      fechaDeConsecucion: faker.date.past(),
    };

    expect(
      await controller.update(restautranteList[0].id, toBeUpdated),
    ).toHaveProperty('nombre', 'Restaurant RRR');
  });

  it('Update invalid Restaurante', async () => {
    const toBeUpdated: RestauranteDto = {
      nombre: 'Restaurant RRR',
      estrellasMichelin: 'NINGUNA',
      fechaDeConsecucion: faker.date.past(),
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });
});
