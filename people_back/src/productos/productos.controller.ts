import {
  Controller,
  Get,
  Put,
  Param,
  Delete,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductRow } from './productos.service';
import { QueryProductosDto } from './dto/query-productos.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async getProducts(@Query() query: QueryProductosDto) {
    return await this.productosService.getProducts(query);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    // return this.productosService.getProductById();
    return 'Detalle del producto' + id;
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: ProductRow) {
    // Si no encuentra el body, solo devuelve el producto
    if (!Object.keys(body).length) {
      throw new BadRequestException('El cuerpo de la solicitud está vacío');
    }

    try {
      const result = await this.productosService.updateProductById(+id, body);
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error al actualizar el producto',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productosService.deleteProductById(+id);
  }
}
