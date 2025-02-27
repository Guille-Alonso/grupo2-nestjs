export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    barcode: string;
    sku: string;
    images?: string[];
    categoryIds?: string[];
}
