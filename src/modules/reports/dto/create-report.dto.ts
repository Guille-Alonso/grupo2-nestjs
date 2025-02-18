import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateReportDto {

    @ApiProperty({description: 'Report url content', example: 'https://google.com'})
    @IsUrl({},{message: i18nValidationMessage('errors.isUrl')})
    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    content: string;

    @ApiProperty({description: 'Report type', example: 'url'})
    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    @IsString({message: i18nValidationMessage('errors.isString')})
    type: string;

    @ApiProperty({description: 'User id', example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1'})
    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    @IsUUID('4', {message: i18nValidationMessage('errors.isUUID')})
    userId: string;
}
