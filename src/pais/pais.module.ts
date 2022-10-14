import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';

@Module({
  providers: [PaisService, JwtService, PaisResolver],
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register()],
  controllers: [PaisController],
})
export class PaisModule {}
