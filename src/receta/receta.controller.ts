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
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Get()
  @SetMetadata('roles', [RoleType.READ])
  async findAll() {
    return this.recetaService.findAll();
  }

  @Get(':recetaId')
  @SetMetadata('roles', [RoleType.READ])
  async findOne(@Param('recetaId') recetaId: string) {
    return this.recetaService.findOne(recetaId);
  }

  @Post()
  @SetMetadata('roles', [RoleType.WRITE])
  async create(@Body() recetaDto: RecetaDto) {
    const receta = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.create(receta);
  }

  @Put(':recetaId')
  @SetMetadata('roles', [RoleType.WRITE])
  async update(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta = plainToInstance(RecetaEntity, recetaDto);
    return this.recetaService.update(recetaId, receta);
  }

  @Delete(':recetaId')
  @SetMetadata('roles', [RoleType.DELETE])
  async delete(@Param('recetaId') recetaId: string) {
    return this.recetaService.delete(recetaId);
  }
}
