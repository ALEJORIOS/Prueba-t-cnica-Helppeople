import { MasivoService } from './masivo.service';
export declare class MasivoController {
    private readonly masivoService;
    constructor(masivoService: MasivoService);
    uploadFile(file: Express.Multer.File): Promise<{
        totalProcessed: number;
        totalInserted: number;
        failed: {
            row: import("../productos/productos.service").ProductRow;
            error: string;
        }[];
    }>;
}
