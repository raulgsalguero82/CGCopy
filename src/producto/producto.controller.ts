import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleType } from '../user/user';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  @SetMetadata('roles', [RoleType.READ])
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  @SetMetadata('roles', [RoleType.READ])
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  @SetMetadata('roles', [RoleType.WRITE])
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  @SetMetadata('roles', [RoleType.WRITE])
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @SetMetadata('roles', [RoleType.DELETE])
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
