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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasivoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const common_2 = require("@nestjs/common");
const sync_1 = require("csv-parse/sync");
const XLSX = require("xlsx");
let MasivoService = class MasivoService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async handleFileUpload(file) {
        let products = [];
        try {
            if (file.mimetype === 'text/csv') {
                products = this.parseCSV(file.buffer);
            }
            else {
                products = this.parseExcel(file.buffer);
            }
        }
        catch (error) {
            throw new common_2.BadRequestException('Error al procesar el archivo: ' + error.message);
        }
        if (!products || products.length === 0) {
            throw new common_2.BadRequestException('El archivo está vacío o no contiene datos válidos');
        }
        this.validateProducts(products);
        const insertResponse = await this.bulkInsert(products);
        return {
            totalProcessed: products.length,
            totalInserted: insertResponse.totalInserted,
            failed: insertResponse.failed,
        };
    }
    parseCSV(buffer) {
        const csvContent = buffer.toString('utf-8');
        const records = (0, sync_1.parse)(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            cast: true,
        });
        return records.map((record) => ({
            categoryId: parseInt(record.categoryId),
            name: record.name?.trim(),
            description: record.description?.trim(),
            sku: record.sku?.trim(),
            price: parseFloat(record.price),
            stock: parseInt(record.stock),
        }));
    }
    parseExcel(buffer) {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
            defval: null,
        });
        return data.map((row) => ({
            categoryId: parseInt(row.categoryId || row.CategoryId || row.CATEGORYID),
            name: String(row.name || row.Name || row.NAME || '').trim(),
            description: String(row.description || row.Description || row.DESCRIPTION || '').trim(),
            sku: String(row.sku || row.SKU || row.Sku || '').trim(),
            price: parseFloat(row.price || row.Price || row.PRICE),
            stock: parseInt(row.stock || row.Stock || row.STOCK),
        }));
    }
    validateProducts(products) {
        const errors = [];
        products.forEach((product, index) => {
            const rowNum = index + 2;
            if (!product.categoryId || isNaN(product.categoryId)) {
                errors.push(`Fila ${rowNum}: categoryId inválido`);
            }
            if (!product.name || product.name.length === 0) {
                errors.push(`Fila ${rowNum}: name es requerido`);
            }
            if (!product.sku || product.sku.length === 0) {
                errors.push(`Fila ${rowNum}: sku es requerido`);
            }
            if (isNaN(product.price) || product.price < 0) {
                errors.push(`Fila ${rowNum}: price inválido`);
            }
            if (isNaN(product.stock) || product.stock < 0) {
                errors.push(`Fila ${rowNum}: stock inválido`);
            }
        });
        if (errors.length > 0) {
            throw new common_2.BadRequestException({
                message: 'Errores de validación en el archivo',
                errors: errors.slice(0, 10),
                totalErrors: errors.length,
            });
        }
    }
    async bulkInsert(products) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const failed = [];
        let totalInserted = 0;
        try {
            const batchSize = 1000;
            for (let i = 0; i < products.length; i += batchSize) {
                const batch = products.slice(i, i + batchSize);
                try {
                    await queryRunner.manager
                        .createQueryBuilder()
                        .insert()
                        .into('Catalog.Products')
                        .values(batch.map((p) => ({
                        categoryId: p.categoryId,
                        name: p.name,
                        description: p.description,
                        sku: p.sku,
                        price: p.price,
                        stock: p.stock,
                    })))
                        .execute();
                    totalInserted += batch.length;
                }
                catch (batchError) {
                    await queryRunner.rollbackTransaction();
                    await queryRunner.startTransaction();
                    for (const product of batch) {
                        try {
                            await queryRunner.manager
                                .createQueryBuilder()
                                .insert()
                                .into('Catalog.Products')
                                .values({
                                categoryId: product.categoryId,
                                name: product.name,
                                description: product.description,
                                sku: product.sku,
                                price: product.price,
                                stock: product.stock,
                            })
                                .execute();
                            totalInserted += 1;
                        }
                        catch (error) {
                            failed.push({ row: product, error: error.message });
                        }
                    }
                }
            }
            await queryRunner.commitTransaction();
            return {
                totalInserted,
                failed,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_2.BadRequestException(`Error crítico al insertar productos: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.MasivoService = MasivoService;
exports.MasivoService = MasivoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MasivoService);
//# sourceMappingURL=masivo.service.js.map