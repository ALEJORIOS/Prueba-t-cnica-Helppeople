import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MasivoController } from './masivo/masivo.controller';
import { MasivoService } from './masivo/masivo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
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
    ProductosModule,
    CategoriasModule,
  ],
  controllers: [AppController, MasivoController],
  providers: [AppService, MasivoService],
})
export class AppModule {}
