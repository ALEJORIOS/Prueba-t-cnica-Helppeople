import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async getCategorias() {
    return await this.categoriasService.getCategorias();
  }

  @Post()
  async createCategoria(@Body() body: NewCategory) {
    return await this.categoriasService.createCategoria(body);
  }

  @Put(':id')
  async updateCategoria(@Param('id') id: string, @Body() body: NewCategory) {
    return await this.categoriasService.updateCategoria(id, body);
  }

  @Delete(':id')
  async deleteCategoria(@Param('id') id: string) {
    return await this.categoriasService.deleteCategoria(id);
  }
}

export interface NewCategory {
  name: string;
  description: string;
}
