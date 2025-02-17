import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  name: string;
}
