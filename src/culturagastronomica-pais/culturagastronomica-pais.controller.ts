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
import { CulturaGastronomicaPaisService } from './culturagastronomica-pais.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturaGastronomicaPaisController {
  constructor(
    private readonly culturagastronomicaPaisService: CulturaGastronomicaPaisService,
  ) {}

  @Post(':culturagastronomicaId/paises/:paisId')
  @SetMetadata('roles', [RoleType.WRITE])
  async addCulturagastronomicaPais(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('paisId') paisId: string,
  ) {
    return await this.culturagastronomicaPaisService.addPaisCulturaGastronomica(
      culturagastronomicaId,
      paisId,
    );
  }

  @Get(':culturagastronomicaId/paises')
  @SetMetadata('roles', [RoleType.READ])
  async findpaisesByCulturagastronomica(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
  ) {
    return await this.culturagastronomicaPaisService.findPaisesByCulturaGastronomicaId(
      culturagastronomicaId,
    );
  }

  @Delete(':culturagastronomicaId/paises/:paisId')
  @SetMetadata('roles', [RoleType.DELETE])
  async deleteCulturagastronomicaPais(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('paisId') paisId: string,
  ) {
    {
      return await this.culturagastronomicaPaisService.deletePaisCulturaGastronomica(
        culturagastronomicaId,
        paisId,
      );
    }
  }
}
