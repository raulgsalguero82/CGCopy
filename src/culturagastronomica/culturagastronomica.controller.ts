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
import { CulturagastronomicaDto } from './culturagastronomica.dto';
import { CulturaGastronomicaEntity } from './culturagastronomica.entity';
import { CulturagastronomicaService } from './culturagastronomica.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturagastronomicaController {
  constructor(
    private readonly culturagastronomicaService: CulturagastronomicaService,
  ) {}

  @Get()
  @SetMetadata('roles', [RoleType.READ, RoleType.READONLY_CULTURA_GASTRONOMICA])
  async findAll() {
    return await this.culturagastronomicaService.findAll();
  }

  @Get(':culturagastronomicaId')
  @SetMetadata('roles', [RoleType.READ, RoleType.READONLY_CULTURA_GASTRONOMICA])
  async findOne(@Param('culturagastronomicaId') culturagastronomicaId: string) {
    return await this.culturagastronomicaService.findOne(culturagastronomicaId);
  }

  @Post()
  @SetMetadata('roles', [RoleType.WRITE])
  async create(@Body() culturagastronomicaDto: CulturagastronomicaDto) {
    const culturagrastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturagastronomicaDto,
    );
    return await this.culturagastronomicaService.create(culturagrastronomica);
  }

  @Put(':culturagastronomicaId')
  @SetMetadata('roles', [RoleType.WRITE])
  async update(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Body() culturagastronomicaDto: CulturagastronomicaDto,
  ) {
    const culturagrastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturagastronomicaDto,
    );
    return await this.culturagastronomicaService.update(
      culturagastronomicaId,
      culturagrastronomica,
    );
  }

  @Delete(':culturagastronomicaId')
  @SetMetadata('roles', [RoleType.DELETE])
  @HttpCode(204)
  async delete(@Param('culturagastronomicaId') culturagastronomicaId: string) {
    return await this.culturagastronomicaService.delete(culturagastronomicaId);
  }
}
