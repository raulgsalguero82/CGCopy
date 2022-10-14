import {
  Controller,
  Delete,
  Param,
  Post,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoleType } from '../user/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RestauranteCiudadController {
  constructor(
    private readonly restauranteCiudadService: RestauranteCiudadService,
  ) {}

  @Post(':restauranteId/ciudades/:ciudadId')
  @SetMetadata('roles', [RoleType.WRITE])
  async addCiudadRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.restauranteCiudadService.associateCiudadRestaurante(
      ciudadId,
      restauranteId,
    );
  }

  @Delete(':restauranteId/ciudades/:ciudadId')
  @SetMetadata('roles', [RoleType.DELETE])
  async deleteCulturagastronomicaRestaurante(
    @Param('restauranteId') restauranteId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    {
      return await this.restauranteCiudadService.deleteCiudadRestaurante(
        ciudadId,
        restauranteId,
      );
    }
  }
}
