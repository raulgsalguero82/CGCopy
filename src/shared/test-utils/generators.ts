import { faker } from '@faker-js/faker';
import { PaisEntity } from '../../pais/pais.entity';
import { CulturaGastronomicaEntity } from '../../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { ProductoEntity } from '../../producto/producto.entity';

export const generateReceta = (): RecetaEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: faker.lorem.sentence(),
    descripcion: faker.lorem.sentence(),
    urlFoto: faker.internet.url(),
    urlVideo: faker.internet.url(),
    procesoDePreparacion: faker.lorem.text(),
  };
};

export const generateCulturaGastronomica = (): CulturaGastronomicaEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: 'Cultura gastronomica de ' + faker.address.country(),
    descripcion: faker.lorem.sentence(),
    recetas: [],
    paises: [],
    restaurantes: [],
    productos: [],
  };
};

export const generatePais = (): PaisEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: faker.address.country(),
    ciudades: [],
  };
};

export const generateRestaurante = (): RestauranteEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: faker.address.country(),
    estrellasMichelin: 'NINGUNA',
    fechaDeConsecucion: faker.date.past(),
  };
};

export const generateCiudad = (): CiudadEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: faker.address.city(),
    restaurantes: [],
    pais: null,
  };
};

export const generateProducto = (): ProductoEntity => {
  return {
    id: faker.database.mongodbObjectId(),
    nombre: 'Producto' + faker.lorem.sentence(),
    historia: faker.lorem.sentence(),
    descripcion: faker.lorem.sentence(),
    categoria: 'FRUTA',
  };
};
