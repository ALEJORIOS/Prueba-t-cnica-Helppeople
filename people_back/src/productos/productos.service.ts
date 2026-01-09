import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './productos.repository';
import { Repository } from 'typeorm/repository/Repository';
import { QueryProductosDto } from './dto/query-productos.dto';
import { PaginatedProductosDto } from './dto/paginated-productos.dto';
import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(
    queryDto?: QueryProductosDto,
  ): Promise<PaginatedProductosDto> {
    const {
      page = 1,
      pageSize = 10,
      search,
      idCategoria,
      precioMin,
      precioMax,
      // activo = true,
      sortBy = 'fechaCreacion',
      sortDir = 'ASC',
    } = queryDto || {};

    const where: any = { Active: true };

    // Lo comento porque está devolviendo en este momento solamente los activos
    // if (activo !== undefined) {
    //   where.Active = activo;
    // }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (idCategoria) {
      where.categoryId = idCategoria;
    }

    if (precioMin !== undefined && precioMax !== undefined) {
      where.price = Between(precioMin, precioMax);
    } else if (precioMin !== undefined) {
      where.price = MoreThanOrEqual(precioMin);
    } else if (precioMax !== undefined) {
      where.price = LessThanOrEqual(precioMax);
    }

    const sortColumnMap: { [key: string]: string } = {
      nombre: 'name',
      precio: 'price',
      fechaCreacion: 'createdAt',
      fechaActualizacion: 'updatedAt',
    };

    const sortColumn = sortColumnMap[sortBy] || 'createdAt';
    const sortDirection = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const total = await this.productRepository.count({ where });

    const products = await this.productRepository.find({
      relations: ['category'],
      where,
      order: {
        [sortColumn]: sortDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const items = products.map((product) => ({
      ...product,
      category: product.category ? product.category.name : null,
      key: product.id,
    }));

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  getProductById(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async updateProductById(id: number, body: ProductRow) {
    return await this.productRepository.update(id, body);
  }

  deleteProductById(id: number) {
    return this.productRepository.update(id, { Active: false });
  }
}

export interface ProductRow {
  categoryId: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
}
