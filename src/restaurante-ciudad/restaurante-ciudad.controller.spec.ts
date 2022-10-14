import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { RestauranteCiudadController } from './restaurante-ciudad.controller';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import {
  generateCiudad,
  generateRestaurante,
} from '../shared/test-utils/generators';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { RestauranteCiudadModule } from './restaurante-ciudad.module';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';

describe('RestauranteCiudadController', () => {
  let controller: RestauranteCiudadController;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];
  let restauranteList: RestauranteEntity[];

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();

    ciudadList = [];
    restauranteList = [];

    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save(
        generateRestaurante(),
      );
      restauranteList.push(restaurante);
    }

    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save(
        generateCiudad(),
      );
      ciudadList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfig, RestauranteCiudadModule],
      controllers: [RestauranteCiudadController],
      providers: [
        RestauranteCiudadService,
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

    controller = module.get<RestauranteCiudadController>(
      RestauranteCiudadController,
    );

    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    await seedDatabase();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Agregar ciudad to restaurante', async () => {
    const restaurant = await controller.addCiudadRestaurante(
      restauranteList[0].id,
      ciudadList[0].id,
    );
    expect(restaurant.ciudad.id).toBe(ciudadList[0].id);
  });
  it('Agregar ciudad inexsitente a restaurante ', async () => {
    await expect(() =>
      controller.addCiudadRestaurante(restauranteList[0].id, '0'),
    ).rejects.toHaveProperty(
      'message',
      `La ciudad con id 0 no se ha encontrado`,
    );
  });
  it('Agregar ciudad a restaurante inexsitente', async () => {
    await expect(() =>
      controller.addCiudadRestaurante('0', ciudadList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });

  it('Remover ciudad de restaurante', async () => {
    const restaurant = await controller.addCiudadRestaurante(
      restauranteList[0].id,
      ciudadList[0].id,
    );

    expect(restaurant.ciudad.id).not.toBe(null);

    const resp = await controller.deleteCulturagastronomicaRestaurante(
      restauranteList[0].id,
      ciudadList[0].id,
    );

    expect(resp.ciudad).not.toBe(ciudadList[0].id);
  });
  it('Borrar ciudad inexsitente a restaurante ', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRestaurante(
        restauranteList[0].id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      `La ciudad con id 0 no se ha encontrado`,
    );
  });
  it('Borrar ciudad de restaurante inexsitente', async () => {
    await expect(() =>
      controller.deleteCulturagastronomicaRestaurante('0', ciudadList[0].id),
    ).rejects.toHaveProperty(
      'message',
      `El restaurante con id 0 no se ha encontrado`,
    );
  });
});
