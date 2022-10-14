import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, Module } from '@nestjs/common';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { RecetaController } from './receta.controller';
import { JwtService } from '@nestjs/jwt';
import { RecetaResolver } from './receta.resolver';

@Module({
  providers: [RecetaService, JwtService, RecetaResolver],
  imports: [
    TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [RecetaController],
})
export class RecetaModule {}
