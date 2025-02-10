import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, Length, Matches, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Product 1' })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('onErrorResumeNext.isString'),
  })
  name: string;

  @ApiProperty({ description: 'Description of the product', example: 'Product 1' })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('onErrorResumeNext.isString'),
  })
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 100 })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsNumber({},{
    message: i18nValidationMessage('onErrorResumeNext.isNumber'),})
  @IsPositive({
    message: i18nValidationMessage('onErrorResumeNext.isPositive'),
  })
  price: number;

  @ApiProperty({ description: 'Stock of the product', example: 10 })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsPositive({
    message: i18nValidationMessage('onErrorResumeNext.isPositive'),
  })
  @IsInt({
    message: i18nValidationMessage('onErrorResumeNext.isInt'),
  })
  stock: number;

  @ApiProperty({ description: 'Barcode of the product', example: '1234567890' })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('onErrorResumeNext.isString'),
  })
  @Matches(/^[0-9]+$/, {
    message: i18nValidationMessage('onErrorResumeNext.numberCode'),
  })
  @Length(13, 13, {
    message: i18nValidationMessage('onErrorResumeNext.length'),
  })
  barcode: string;

  @ApiProperty({ description: 'Sku of the product', example: '1234567890' })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('onErrorResumeNext.isString'),
  })
  @MaxLength(20, {
    message: i18nValidationMessage('onErrorResumeNext.maxLength'),
  })
  sku: string;

  @ApiProperty({ description: 'Images of the product', example: 'image1.jpg,image2.jpg' })
  @IsNotEmpty({
    message: i18nValidationMessage('onErrorResumeNext.isNotEmpty'),
  })
  @IsUrl({},{
    message: i18nValidationMessage('onErrorResumeNext.isUrl'),})
  images?: string[];

  @ApiProperty({ description: 'Category ids of the product', example: '1,2,3' })
  @IsArray( {
    message: i18nValidationMessage('onErrorResumeNext.isString'),
  })
  categoryIds?: string[];
}
