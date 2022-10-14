import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { JwtService } from '@nestjs/jwt';
import { RestauranteResolver } from './restaurante.resolver';

@Module({
  providers: [RestauranteService, JwtService, RestauranteResolver],
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity]),
    CacheModule.register(),
  ],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
