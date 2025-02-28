import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  @Transform(({ value }) =>
      typeof value === 'string'
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value,
    )
  name: string;
}
