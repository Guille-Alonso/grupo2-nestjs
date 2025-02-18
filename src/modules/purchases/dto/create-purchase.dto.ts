import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { CreateProductDto } from "src/modules/products/dto/create-product.dto";


export class ProductPurchase{

    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    @ValidateNested()
    @Type(()=>CreateProductDto)
    product: CreateProductDto;
}

export class CreatePurchaseDto {
    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    @ArrayMinSize(1)
    @ArrayMaxSize(15)
    @ValidateNested({each:true})
    @Type(()=>ProductPurchase)
    productPurchase: ProductPurchase[];
}
