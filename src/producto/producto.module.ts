import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductoResolver } from './producto.resolver';

@Module({
  providers: [ProductoService, JwtService, ProductoResolver],
  imports: [TypeOrmModule.forFeature([ProductoEntity]), CacheModule.register()],
  controllers: [ProductoController],
})
export class ProductoModule {}
