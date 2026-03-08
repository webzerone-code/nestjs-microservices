import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCreatedDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['DRAFT', 'ACTIVE'])
  status: 'DRAFT' | 'ACTIVE';

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
