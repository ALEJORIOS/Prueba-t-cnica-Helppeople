import { CategoriasService } from './categorias.service';
export declare class CategoriasController {
    private readonly categoriasService;
    constructor(categoriasService: CategoriasService);
    getCategorias(): Promise<import("./categorias.repository").Category[]>;
    createCategoria(body: NewCategory): Promise<import("./categorias.repository").Category>;
    updateCategoria(id: string, body: NewCategory): Promise<import("./categorias.repository").Category>;
    deleteCategoria(id: string): Promise<import("typeorm").UpdateResult>;
}
export interface NewCategory {
    name: string;
    description: string;
}
