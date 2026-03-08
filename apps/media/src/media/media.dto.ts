import { IsOptional, IsString } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  fileName: string;
  @IsString()
  mimetype: string;
  @IsString()
  base64: string;
  @IsString()
  uploadedByUserId: string;
}

export class AttachToProductDto {
  @IsString()
  mediaId: string;

  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  attachedByUserId?: string;
}
