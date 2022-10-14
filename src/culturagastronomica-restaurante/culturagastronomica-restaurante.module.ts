import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { CulturagastronomicaRestauranteController } from './culturagastronomica-restaurante.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CulturagastronomicaRestauranteService, JwtService],
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [CulturagastronomicaRestauranteController],
})
export class CulturagastronomicaRestauranteModule {}
