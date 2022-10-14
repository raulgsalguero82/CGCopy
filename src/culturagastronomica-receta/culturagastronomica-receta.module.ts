import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaRecetaService } from './culturagastronomica-receta.service';
import { CulturagastronomicaRecetaController } from './culturagastronomica-receta.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CulturaGastronomicaRecetaService, JwtService],
  imports: [
    TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [CulturagastronomicaRecetaController],
})
export class CulturaGastronomicaRecetaModule {}
