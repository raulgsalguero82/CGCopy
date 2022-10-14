import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaPaisService } from './culturagastronomica-pais.service';
import { CulturaGastronomicaPaisController } from './culturagastronomica-pais.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CulturaGastronomicaPaisService, JwtService],
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, PaisEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [CulturaGastronomicaPaisController],
})
export class CulturaGastronomicaPaisModule {}
