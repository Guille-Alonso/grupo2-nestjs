import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


export class CreaterCartLineDTO {

   
 @IsPositive({
  message: i18nValidationMessage('errors.isPositive'),
})
 @IsNumber({},
  {
    message: i18nValidationMessage('errors.isNumber'),
  },)
 quantity: number;
 
 @IsNotEmpty({
  message: i18nValidationMessage('errors.isNotEmpty'),
})
 @IsString({
  message: i18nValidationMessage('errors.isString'),
}) 
 productId: string;   
}

export class CreateCartDto {

@ApiProperty({
    description: 'Productos añadidos al carrito',
    type: 'array',
    items: { type: 'object', $ref: '#/components/schemas/CreateCartLineDTO' }, // Referencia al DTO
    example: [
      { quantity: 2, productId: 'b5e0318f-0105-4ae1-bf67-9edec9a9b4f1' },
      { quantity: 1, productId: 'b5e0311f-1105-1Be1-bQ17-2Adec9a9b4f1' },
    ],
  })
@IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
@IsArray({ message: i18nValidationMessage('errors.isString') })
@ArrayMinSize(1,{message: i18nValidationMessage('errors.arrayMin', {x:1})})
@ArrayMaxSize(15,{message:i18nValidationMessage('errors.arrayMax',{x:15})})
@ValidateNested({each:true})
@Type(()=>CreaterCartLineDTO)
cartLine: CreaterCartLineDTO[];
    
}
