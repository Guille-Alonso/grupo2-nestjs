import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';

export class FilterProductsDto extends PartialType(PaginationDto) {
  @ApiProperty({ description: 'Product name', example: 'Product 1', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product SKU', example: '1234', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Product min price', example: '100', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ description: 'Product max price', example: '100', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({ description: 'Product category', example: 'Electronics', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}
