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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaProductoService } from './culturagastronomica-producto.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleType } from '../user/user';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturaGastronomicaProductoController {
  constructor(
    private readonly culturagastronomicaProductoService: CulturaGastronomicaProductoService,
  ) {}

  @Post(':culturagastronomicaId/productos/:productoId')
  @SetMetadata('roles', [RoleType.WRITE])
  async addCulturagastronomicaProducto(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturagastronomicaProductoService.addProductoCulturaGastronomica(
      culturagastronomicaId,
      productoId,
    );
  }

  @Get(':culturagastronomicaId/productos')
  @SetMetadata('roles', [RoleType.READ])
  async findproductosByCulturagastronomica(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
  ) {
    return await this.culturagastronomicaProductoService.findProductosByCulturaGastronomicaId(
      culturagastronomicaId,
    );
  }

  @Delete(':culturagastronomicaId/productos/:productoId')
  @SetMetadata('roles', [RoleType.DELETE])
  async deleteCulturagastronomicaProducto(
    @Param('culturagastronomicaId') culturagastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    {
      return await this.culturagastronomicaProductoService.deleteProductoCulturaGastronomica(
        culturagastronomicaId,
        productoId,
      );
    }
  }
}
