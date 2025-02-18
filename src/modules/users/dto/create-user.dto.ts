import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
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
    message: i18nValidationMessage('errors.length'),
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
    message: i18nValidationMessage('errors.length'),
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
  @MinLength(8, {
     message: i18nValidationMessage('errors.length'),
   })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.userRol'),
  })
  @IsEnum(Role, { message:  i18nValidationMessage('errors.userRol') })
  role: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
