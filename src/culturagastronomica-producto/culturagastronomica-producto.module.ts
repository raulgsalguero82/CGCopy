import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../culturagastronomica/culturagastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaGastronomicaProductoService } from './culturagastronomica-producto.service';
import { CulturaGastronomicaProductoController } from './culturagastronomica-producto.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CulturaGastronomicaProductoService, JwtService],
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [CulturaGastronomicaProductoController],
})
export class CulturaGastronomicaProductoModule {}
