import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RecoverPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'joe@gmail.com',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsEmail({}, { message: i18nValidationMessage('errors.isEmail'), })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString({
     message: i18nValidationMessage('errors.isString'),
   })
   @IsNotEmpty({
     message: i18nValidationMessage('errors.isNotEmpty'),
   })
   @MinLength(8,{message: i18nValidationMessage('errors.min',{constraint1:8}) })
  password: string;

  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @MinLength(8,{message: i18nValidationMessage('errors.min',{constraint1:8}) })
  confirmPassword: string;
}
