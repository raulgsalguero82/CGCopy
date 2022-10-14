import {
  Body,
  Controller,
  Delete,
  Get,
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
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  @SetMetadata('roles', [RoleType.READ])
  async findAll() {
    return this.restauranteService.findAll();
  }

  @Get(':restauranteId')
  @SetMetadata('roles', [RoleType.READ])
  async findOne(@Param('restauranteId') restauranteId: string) {
    return this.restauranteService.findOne(restauranteId);
  }

  @Post()
  @SetMetadata('roles', [RoleType.WRITE])
  async create(@Body() restauranteDto: RestauranteDto) {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.create(restaurante);
  }

  @Put(':restauranteId')
  @SetMetadata('roles', [RoleType.WRITE])
  async update(
    @Param('restauranteId') restauranteId: string,
    @Body() restauranteDto: RestauranteDto,
  ) {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.update(restauranteId, restaurante);
  }

  @Delete(':restauranteId')
  @SetMetadata('roles', [RoleType.DELETE])
  async delete(@Param('restauranteId') restauranteId: string) {
    return this.restauranteService.delete(restauranteId);
  }
}
