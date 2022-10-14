import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisId')
  async findOne(@Param('paisId') paisId: string) {
    return await this.paisService.findOne(paisId);
  }

  @Post()
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisId')
  async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @Delete(':paisId')
  @HttpCode(204)
  async delete(@Param('paisId') paisId: string) {
    return await this.paisService.delete(paisId);
  }
}
