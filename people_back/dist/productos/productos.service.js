"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const productos_repository_1 = require("./productos.repository");
const Repository_1 = require("typeorm/repository/Repository");
const typeorm_2 = require("typeorm");
let ProductosService = class ProductosService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getProducts(queryDto) {
        const { page = 1, pageSize = 10, search, idCategoria, precioMin, precioMax, sortBy = 'fechaCreacion', sortDir = 'ASC', } = queryDto || {};
        const where = { Active: true };
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (idCategoria) {
            where.categoryId = idCategoria;
        }
        if (precioMin !== undefined && precioMax !== undefined) {
            where.price = (0, typeorm_2.Between)(precioMin, precioMax);
        }
        else if (precioMin !== undefined) {
            where.price = (0, typeorm_2.MoreThanOrEqual)(precioMin);
        }
        else if (precioMax !== undefined) {
            where.price = (0, typeorm_2.LessThanOrEqual)(precioMax);
        }
        const sortColumnMap = {
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
    getProductById(id) {
        return this.productRepository.findOne({ where: { id } });
    }
    async updateProductById(id, body) {
        return await this.productRepository.update(id, body);
    }
    deleteProductById(id) {
        return this.productRepository.update(id, { Active: false });
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(productos_repository_1.Product)),
    __metadata("design:paramtypes", [Repository_1.Repository])
], ProductosService);
//# sourceMappingURL=productos.service.js.map