import { Product } from './productos.repository';
import { Repository } from 'typeorm/repository/Repository';
import { QueryProductosDto } from './dto/query-productos.dto';
import { PaginatedProductosDto } from './dto/paginated-productos.dto';
export declare class ProductosService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    getProducts(queryDto?: QueryProductosDto): Promise<PaginatedProductosDto>;
    getProductById(id: number): Promise<Product>;
    updateProductById(id: number, body: ProductRow): Promise<import("typeorm").UpdateResult>;
    deleteProductById(id: number): Promise<import("typeorm").UpdateResult>;
}
export interface ProductRow {
    categoryId: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number;
}
