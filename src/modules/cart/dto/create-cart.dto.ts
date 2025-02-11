
export class CreaterCartLineDTO {
 cartId: string;
 quantiy: number;
 unit_price:number;
 productId: string;   
}

export class CreateCartDto {
    
userId: string;

cartLine: CreaterCartLineDTO[];
    


}
