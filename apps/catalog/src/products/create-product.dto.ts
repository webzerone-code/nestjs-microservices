import type { ProductStatus } from './product.schema';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(10000000000)
  price: number;

  @IsString()
  status: ProductStatus;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  userId: string;
}

export class GetProductByIdDto {
  @IsString()
  productId: string;
}

export class UpdateProductDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(10000000000)
  price: number;

  @IsOptional()
  @IsString()
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  userId: string;
}
