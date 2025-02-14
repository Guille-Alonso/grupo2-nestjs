import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateImageDto {
  @ApiProperty({ description: 'Image name', example: 'image.jpg' })
  @IsArray({ message: i18nValidationMessage('errors.isArray') })
  @IsOptional()
  coleccion?: string[];

  @ApiProperty({ description: 'Product id', example: 'hkasf-asohfioasf' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  productId: string;
}
