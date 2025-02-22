import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  @ApiProperty({ description: 'User email', example: 'user@email.com' })
  @IsEmail({},{message: i18nValidationMessage('errors.isEmail')})
  @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
  email: string;

  @ApiProperty({ description: 'User password', example: 'password' })
  @IsString({ message: i18nValidationMessage('errors.isString') })
  @IsNotEmpty({ message: i18nValidationMessage('errors.isNotEmpty') })
  @MinLength(8,{message: i18nValidationMessage('errors.min',{constraint1:8}) })
  password: string;
}
