import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { CulturagastronomicaModule } from './culturagastronomica/culturagastronomica.module';
import { PaisModule } from './pais/pais.module';
import { TypeOrmConfig } from './typeorm-config';
import { RecetaModule } from './receta/receta.module';
import { ProductoModule } from './producto/producto.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CulturaGastronomicaRecetaModule } from './culturagastronomica-receta/culturagastronomica-receta.module';
import { RestauranteCiudadModule } from './restaurante-ciudad/restaurante-ciudad.module';
import { CulturaGastronomicaPaisModule } from './culturagastronomica-pais/culturagastronomica-pais.module';
import { CulturagastronomicaRestauranteModule } from './culturagastronomica-restaurante/culturagastronomica-restaurante.module';
import { CulturaGastronomicaProductoModule } from './culturagastronomica-producto/culturagastronomica-producto.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ...TypeOrmConfig,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    CulturagastronomicaModule,
    PaisModule,
    CiudadModule,
    RecetaModule,
    ProductoModule,
    RestauranteModule,
    CulturaGastronomicaRecetaModule,
    RestauranteCiudadModule,
    CulturaGastronomicaPaisModule,
    CulturagastronomicaRestauranteModule,
    CulturaGastronomicaProductoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
