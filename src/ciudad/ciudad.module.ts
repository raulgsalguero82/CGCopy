import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { CiudadController } from './ciudad.controller';
import { JwtService } from '@nestjs/jwt';
import { CiudadResolver } from './ciudad.resolver';

@Module({
  providers: [CiudadService, JwtService, CiudadResolver],
  imports: [TypeOrmModule.forFeature([CiudadEntity]), CacheModule.register()],
  controllers: [CiudadController],
})
export class CiudadModule {}
