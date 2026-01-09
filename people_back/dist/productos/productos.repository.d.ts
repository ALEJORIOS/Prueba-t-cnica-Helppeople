import { Category } from '../categorias/categorias.repository';
export declare class Product {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number;
    Active: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
}
