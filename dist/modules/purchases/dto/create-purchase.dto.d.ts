import { CreateProductDto } from "src/modules/products/dto/create-product.dto";
export declare class ProductPurchase {
    product: CreateProductDto;
}
export declare class CreatePurchaseDto {
    productPurchase: ProductPurchase[];
}
