import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  q: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}
