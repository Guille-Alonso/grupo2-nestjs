import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'joe',
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @Length(2, 40, {
    message: i18nValidationMessage('errors.length',{constraint1:2, constraint2:40}) ,
  })
  name: string;

  @ApiProperty({
    description: 'User lastName',
    example: 'doe',
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @Length(2, 40, {
    message: i18nValidationMessage('errors.length',{constraint1:2, constraint2:40}) ,
  })
  lastName: string;

  @ApiProperty({
    description: 'User email',
    example: 'joe@gmail.com',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @IsEmail({}, { message: i18nValidationMessage('errors.isEmail'), })
  email: string;

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
}