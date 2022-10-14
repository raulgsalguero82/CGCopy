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
import { CulturaGastronomicaRecetaService } from './culturagastronomica-receta.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturagastronomicaRecetaController {
  constructor(
    private readonly culturagastronomicaRecetaService: CulturaGastronomicaRecetaService,
  ) {}

  @Post(':culturagastronomicaId/recetas/:recetaId')
  @SetMetadata('roles', [RoleType.WRITE])
  async addCulturagastronomicaReceta(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return this.culturagastronomicaRecetaService.addRecetaCulturaGastronomica(
      culturagastronomicaId,
      recetaId,
    );
  }

  @Get(':culturagastronomicaId/recetas')
  @SetMetadata('roles', [RoleType.READ])
  async findRecetaByCulturagastronomica(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
  ) {
    return this.culturagastronomicaRecetaService.findRecetasByCulturaGastronomicaId(
      culturagastronomicaId,
    );
  }

  @Delete(':culturagastronomicaId/recetas/:recetaId')
  @SetMetadata('roles', [RoleType.DELETE])
  async deleteCulturagastronomicaRceta(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    {
      return this.culturagastronomicaRecetaService.deleteRecetaCulturaGastronomica(
        culturagastronomicaId,
        recetaId,
      );
    }
  }
}
