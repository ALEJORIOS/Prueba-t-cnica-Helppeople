import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idCategoria?: number;

  @IsOptional()
  @Type(() => Number)
  precioMin?: number;

  @IsOptional()
  @Type(() => Number)
  precioMax?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean = true;

  @IsOptional()
  @IsString()
  @IsIn(['nombre', 'precio', 'fechaCreacion', 'fechaActualizacion'])
  sortBy?: string = 'fechaActualizacion';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortDir?: string = 'desc';
}
