import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";
import { Message } from "node-mailjet";

export class CreaterCartLineDTO {

 @IsPositive()
 @IsNumber()
 quantity: number;
 
 @IsNotEmpty()
 @IsString() 
 productId: string;   
}

export class CreateCartDto {
@IsNotEmpty()
@IsString()
userId: string;

@IsNotEmpty()
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(15)
@ValidateNested({each:true})
@Type(()=>CreaterCartLineDTO)
cartLine: CreaterCartLineDTO[];
    
}
