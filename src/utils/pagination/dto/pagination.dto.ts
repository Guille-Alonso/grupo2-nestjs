import { IsOptional, IsInt, Min, IsString, IsIn, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class PaginationDto2 {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @IsInt({message: i18nValidationMessage('errors.isInt')})
  @Min(1,{message: i18nValidationMessage('errors.min')})
  page?: number = 1;
  @ApiProperty({ description: 'Page size', example: 10, required: false })
  @IsOptional()
  @IsInt({message: i18nValidationMessage('errors.isInt')})
  @Min(1,{message: i18nValidationMessage('errors.min')})
  pageSize?: number = 10;

  @ApiProperty({ description: 'Sort by field', example: 'name', required: false })
  @IsOptional()
  @IsString({message: i18nValidationMessage('errors.isString')})
  sortBy?: string = 'createdAt'; // Campo por defecto

  @ApiProperty({ description: 'Sort order', example: 'asc', required: false })
  @IsOptional()
  @IsIn(['asc', 'desc'],{message: i18nValidationMessage('errors.isIn')})
  sortOrder?: 'asc' | 'desc' = 'desc'; // Orden por defecto
}

export class PaginationDto{
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ description: 'Per Page', example: 10, required: false })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  perPage: number = 10;

  @ApiProperty({ description: 'Search', example: "Timoty", required: false })
  @IsOptional()
  @IsString()
  search?: string;
}