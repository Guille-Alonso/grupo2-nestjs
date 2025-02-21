import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RoleEnum } from 'src/common/constants';

export class CreateProfileDto {
  @ApiProperty({
    description: 'User Address',
    example: '47 street',
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @Length(5, 60, {
    message: i18nValidationMessage('errors.length',{constraint1:5, constraint2:60}) ,
  })
  address: string;

  @ApiProperty({
    description: 'User Phone',
    example: '3816587452',
  })
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.isNotEmpty'),
  })
  @Length(5, 15, {
    message: i18nValidationMessage('errors.length',{constraint1:5, constraint2:15}) ,
  })
  phone: string;

}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}