import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleType } from '../user/user';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturagastronomicaRestauranteController {
  constructor(
    private readonly culturagastronomicaRestauranteService: CulturagastronomicaRestauranteService,
  ) {}

  @Post(':culturagastronomicaId/restaurantes/:restauranteId')
  @SetMetadata('roles', [RoleType.WRITE])
  async addCulturagastronomicaRestaurante(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturagastronomicaRestauranteService.associateRestauranteCulturaGastronomica(
      culturagastronomicaId,
      restauranteId,
    );
  }

  @Get(':culturagastronomicaId/restaurantes')
  @SetMetadata('roles', [RoleType.READ])
  async findRestaurantesByCulturagastronomica(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
  ) {
    return await this.culturagastronomicaRestauranteService.getRestauranteByCulturaGastronomica(
      culturagastronomicaId,
    );
  }

  @Delete(':culturagastronomicaId/restaurantes/:restauranteId')
  @SetMetadata('roles', [RoleType.DELETE])
  async deleteCulturagastronomicaRestaurante(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    {
      return await this.culturagastronomicaRestauranteService.deleteRestauranteCulturaGastronomica(
        culturagastronomicaId,
        restauranteId,
      );
    }
  }
}
