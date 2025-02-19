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
    message: i18nValidationMessage('errors.length'),
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
    message: i18nValidationMessage('errors.length'),
  })
  phone: string;

//   @ApiProperty({
//     description: 'User Photo',
//     example: 'www.myphoto.com.ar',
//   })
//   @IsString({
//     message: i18nValidationMessage('errors.isString'),
//   })
//   @IsNotEmpty({
//     message: i18nValidationMessage('errors.isNotEmpty'),
//   })
//   @Length(5, 100, {
//     message: i18nValidationMessage('errors.length'),
//   })
//   photo: string;

  @ApiProperty({ description: 'id of User', example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1' })
  @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
  @IsString({
    message: i18nValidationMessage('errors.isString'),
  })
  userId: string;

}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}