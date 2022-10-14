import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { generateReceta } from '../shared/test-utils/generators';
import { Repository } from 'typeorm';
import { RecetaController } from '../receta/receta.controller';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaModule } from '../receta/receta.module';
import { RecetaService } from '../receta/receta.service';
import { RecetaDto } from '../receta/receta.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('RecetaController', () => {
  let controller: RecetaController;
  let repository: Repository<RecetaEntity>;
  let recetaList: RecetaEntity[];
  let cache: Cache;

  const seedDatabase = async () => {
    repository.clear();
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save(generateReceta());
      recetaList.push(receta);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        TypeOrmModule.forFeature([RecetaEntity]),
        RecetaModule,
      ],
      controllers: [RecetaController],
      providers: [
        RecetaService,
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

    controller = module.get<RecetaController>(RecetaController);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    cache = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all recetas', async () => {
    const spy = jest.spyOn(cache, 'get');
    await controller.findAll();
    expect(spy).toHaveBeenCalled();
  });

  it('Should return 1 item', async () => {
    const receta: RecetaEntity = recetaList[0];

    const result: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });

    expect((await controller.findOne(receta.id)).id).toBe(result.id);
  });

  it('Should fail returning 1 receta', async () => {
    await expect(controller.findOne('0')).rejects.toHaveProperty('type', 404);
  });

  it('Create Receta', async () => {
    const receta: RecetaDto = generateReceta();

    expect(await controller.create(receta)).toMatchObject(receta);
  });

  it('Delete Receta failing', async () => {
    await expect(controller.delete('0')).rejects.toHaveProperty('type', 404);
  });

  it('Update Receta', async () => {
    const toBeUpdated: RecetaDto = {
      nombre: 'Bandeja Paisa',
      descripcion: 'Descripción receta',
      urlFoto: 'img.img',
      urlVideo: 'mp4.mp4',
      procesoDePreparacion: 'Proceso...',
    };

    expect(
      await controller.update(recetaList[0].id, toBeUpdated),
    ).toHaveProperty('nombre', 'Bandeja Paisa');
  });

  it('Update invalid Receta', async () => {
    const toBeUpdated: RecetaDto = {
      nombre: 'Bandeja Paisa',
      descripcion: 'Descripción receta',
      urlFoto: 'img.img',
      urlVideo: 'mp4.mp4',
      procesoDePreparacion: 'Proceso...',
    };

    await expect(() =>
      controller.update('0', toBeUpdated),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id 0 no se ha encontrado`,
    );
  });
});
