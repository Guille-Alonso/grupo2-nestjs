import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class FilterProductsDto extends PartialType(PaginationDto2) {
  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.isString') })
  name?: string;

  @ApiProperty({ description: 'Product SKU', example: '1234', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.isString') })
  sku?: string;

  @ApiProperty({
    description: 'Product min price',
    example: '100',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: i18nValidationMessage('errors.isNumber') })
  @Min(0, { message: i18nValidationMessage('errors.min',{constraint1:0}) })
  minPrice?: number;

  @ApiProperty({
    description: 'Product max price',
    example: '100',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: i18nValidationMessage('errors.isNumber') })
  @Min(0, { message: i18nValidationMessage('errors.min',{constraint1:0}) })
  maxPrice?: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.isString') })
  category?: string;
}
