import { Category } from './categorias.repository';
import { Repository } from 'typeorm/repository/Repository';
import { NewCategory } from './categorias.controller';
export declare class CategoriasService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    getCategorias(): Promise<Category[]>;
    createCategoria(body: NewCategory): Promise<Category>;
    updateCategoria(id: string, body: NewCategory): Promise<Category>;
    deleteCategoria(id: string): Promise<import("typeorm").UpdateResult>;
}
