import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
declare const FilterProductsDto_base: import("@nestjs/common").Type<Partial<PaginationDto2>>;
export declare class FilterProductsDto extends FilterProductsDto_base {
    name?: string;
    sku?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
}
export {};
