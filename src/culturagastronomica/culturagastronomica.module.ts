import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';
import { CulturagastronomicaController } from './culturagastronomica.controller';
import { JwtService } from '@nestjs/jwt';
import { CulturagastronomicaResolver } from './culturagastronomica.resolver';

@Module({
  providers: [
    CulturagastronomicaService,
    JwtService,
    CulturagastronomicaResolver,
  ],
  imports: [
    TypeOrmModule.forFeature([
      CulturaGastronomicaEntity,
      RecetaEntity,
      PaisEntity,
    ]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [CulturagastronomicaController],
})
export class CulturagastronomicaModule {}
