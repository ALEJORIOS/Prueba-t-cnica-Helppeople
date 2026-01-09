"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const productos_module_1 = require("./productos/productos.module");
const categorias_module_1 = require("./categorias/categorias.module");
const masivo_controller_1 = require("./masivo/masivo.controller");
const masivo_service_1 = require("./masivo/masivo.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mssql',
                    host: config.get('DB_HOST'),
                    port: parseInt(config.get('DB_PORT')),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    options: {
                        encrypt: false,
                        trustServerCertificate: true,
                    },
                    synchronize: false,
                    logging: true,
                    entities: [__dirname + '/**/*.repository{.ts,.js}'],
                }),
            }),
            productos_module_1.ProductosModule,
            categorias_module_1.CategoriasModule,
        ],
        controllers: [app_controller_1.AppController, masivo_controller_1.MasivoController],
        providers: [app_service_1.AppService, masivo_service_1.MasivoService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map