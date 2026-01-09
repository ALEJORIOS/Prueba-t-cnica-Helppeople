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
exports.MasivoController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const masivo_service_1 = require("./masivo.service");
let MasivoController = class MasivoController {
    constructor(masivoService) {
        this.masivoService = masivoService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_2.BadRequestException('No se proporcionó ningún archivo');
        }
        const allowedMimeTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_2.BadRequestException('Formato de archivo no válido. Solo se permiten CSV y Excel (.xls, .xlsx)');
        }
        return this.masivoService.handleFileUpload(file);
    }
};
exports.MasivoController = MasivoController;
__decorate([
    (0, common_2.Post)(''),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasivoController.prototype, "uploadFile", null);
exports.MasivoController = MasivoController = __decorate([
    (0, common_1.Controller)('productosMasivo'),
    __metadata("design:paramtypes", [masivo_service_1.MasivoService])
], MasivoController);
//# sourceMappingURL=masivo.controller.js.map