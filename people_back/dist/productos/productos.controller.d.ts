import { ProductosService } from './productos.service';
import { ProductRow } from './productos.service';
import { QueryProductosDto } from './dto/query-productos.dto';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    getProducts(query: QueryProductosDto): Promise<import("./dto/paginated-productos.dto").PaginatedProductosDto>;
    getProductById(id: string): string;
    updateProduct(id: string, body: ProductRow): Promise<import("typeorm").UpdateResult>;
    deleteProduct(id: string): Promise<import("typeorm").UpdateResult>;
}
