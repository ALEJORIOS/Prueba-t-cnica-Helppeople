import { Module } from '@nestjs/common';
import { Category } from './categorias.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
