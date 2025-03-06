import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Product 1' })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : value,
  )
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Product 1',
  })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : value,
  )
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 100 })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('errors.isNumber'),
    },
  )
  @IsPositive({
    message: i18nValidationMessage('errors.isPositive'),
  })
  price: number;

  @ApiProperty({ description: 'Stock of the product', example: 10 })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsPositive({
    message: i18nValidationMessage('errors.isPositive'),
  })
  @IsInt({
    message: i18nValidationMessage('errors.isInt'),
  })
  stock: number;

  @ApiProperty({
    description: 'Barcode of the product',
    example: '1234567890123',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @Matches(/^[0-9]+$/, {
    message: i18nValidationMessage('errors.numberCode'),
  })
  @Length(13, 13, {
    message: i18nValidationMessage('errors.length', {
      constraint1: 13,
      constraint2: 13,
    }),
  })
  barcode: string;

  @ApiProperty({ description: 'Sku of the product', example: '1234567890' })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage('oerrors.maxLength', { constraint1: 50 }),
  })
  sku: string;

  @ApiProperty({
    description: 'Images of the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.png',
    ],
  })
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('errors.isArrayString') })
  @IsUrl({}, { each: true, message: i18nValidationMessage('errors.isUrl') })
  @IsNotEmpty({ each: true, message: i18nValidationMessage('errors.isNotEmpty') })
  images?: string[];

  @ApiProperty({
    description: 'Category ids of the product',
    example: [
      '12c93ed5-39e7-4ca2-bc5c-55b1f92dd622',
      '710813cb-65c8-49c6-9b6c-f34f151257f3',
    ],
  })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  @IsArray({ message: i18nValidationMessage('errors.isArrayUUID') })
  @IsUUID('4', {
    each: true,
    message: i18nValidationMessage('errors.isArrayUUID'),
  })
  categoryIds?: string[];
}
