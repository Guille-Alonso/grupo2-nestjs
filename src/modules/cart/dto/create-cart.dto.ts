import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreaterCartLineDTO {

 @IsPositive()
 @IsNumber()
 quantity: number;

 @IsPositive()
 @IsNumber()
 unit_price:number;
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
cartLine: CreaterCartLineDTO[];
    
}
