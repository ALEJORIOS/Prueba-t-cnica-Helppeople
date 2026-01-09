import { DataSource } from 'typeorm';
import { ProductRow } from 'src/productos/productos.service';
export declare class MasivoService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    handleFileUpload(file: Express.Multer.File): Promise<{
        totalProcessed: number;
        totalInserted: number;
        failed: {
            row: ProductRow;
            error: string;
        }[];
    }>;
    private parseCSV;
    private parseExcel;
    private validateProducts;
    private bulkInsert;
}
