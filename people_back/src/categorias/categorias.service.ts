import { Injectable } from '@nestjs/common';
import { Category } from './categorias.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { NewCategory } from './categorias.controller';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async getCategorias(): Promise<Category[]> {
    return await this.categoryRepository.find({ where: { Active: true } });
  }

  async createCategoria(body: NewCategory) {
    const category = this.categoryRepository.create(body);
    return await this.categoryRepository.save(category);
  }

  async updateCategoria(id: string, body: NewCategory) {
    await this.categoryRepository.update(id, body);
    return this.categoryRepository.findOneBy({ id: +id });
  }

  async deleteCategoria(id: string) {
    return await this.categoryRepository.update(id, { Active: false });
  }
}
