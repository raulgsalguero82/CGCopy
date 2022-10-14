import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { RestauranteCiudadController } from './restaurante-ciudad.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RestauranteCiudadService, JwtService],
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity, CiudadEntity]),
    CacheModule.register(),
  ],
  exports: [TypeOrmModule],
  controllers: [RestauranteCiudadController],
})
export class RestauranteCiudadModule {}
