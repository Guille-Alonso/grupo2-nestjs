import { ApiProperty } from "@nestjs/swagger";
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

@ApiProperty({
    description: 'Productos añadidos al carrito',
    type: 'array',
    items: { type: 'object', $ref: '#/components/schemas/ProductPurchase'}, // Referencia al DTO
    example: [
      { product:{name:"pepsi", description: "330ml", price:12.11, stock:2, barcode:"5449000000996", sku:"00000001"} },
      { product:{name:"coca", description: "330ml", price:13.11, stock:12, barcode:"5449021000996", sku:"00000002"} },
    ],
  })

    @IsNotEmpty({message: i18nValidationMessage('errors.isNotEmpty')})
    @ArrayMinSize(1)
    @ArrayMaxSize(15)
    @ValidateNested({each:true})
    @Type(()=>ProductPurchase)
    productPurchase: ProductPurchase[];
}
