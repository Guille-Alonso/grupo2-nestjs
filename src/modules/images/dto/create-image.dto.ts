import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateImageDto {
  @ApiProperty({ description: 'Image name', example: ['https://example.com/image1.jpg', 'https://example.com/image2.png'] })
  @IsArray({ message: i18nValidationMessage('errors.isArray') })
  @IsUrl({}, { each: true, message: i18nValidationMessage('errors.isUrl') })
 // @Matches(/\.(jpg|png)$/i, { each: true, message: i18nValidationMessage('errors.isImage') })
  @IsOptional()
  colection?: string[];

  @ApiProperty({ description: 'Product id', example: 'hkasf-asohfioasf' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  productId: string;
}
