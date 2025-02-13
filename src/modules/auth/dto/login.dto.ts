import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  @ApiProperty({ description: 'User email', example: 'user@email.com' })
  @IsEmail({},{message: i18nValidationMessage('errors.isEmail')})
  @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
  email: string;

  @ApiProperty({ description: 'User password', example: 'password' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  password: string;
}
