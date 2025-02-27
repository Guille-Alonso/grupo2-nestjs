import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        message: string;
        product: {
            categorys: {
                productId: string;
                categoryId: string;
            }[];
        } & {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        };
    }>;
    findAll(paginationDto2: PaginationDto2): Promise<{
        data: {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        images: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            colection: string[];
            productId: string;
        };
        categorys: ({
            category: {
                name: string;
                createdAt: Date;
                id: string;
                updatedAt: Date;
                isDeleted: boolean;
            };
        } & {
            productId: string;
            categoryId: string;
        })[];
    } & {
        description: string;
        name: string;
        price: number;
        stock: number;
        barcode: string;
        sku: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        isDeleted: boolean;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        updatedProduct: {
            categorys: {
                productId: string;
                categoryId: string;
            }[];
        } & {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        deleteProduct: {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        };
    }>;
    filter(filter: FilterProductsDto): Promise<{
        data: ({
            images: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                isDeleted: boolean;
                colection: string[];
                productId: string;
            };
            categorys: ({
                category: {
                    name: string;
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    isDeleted: boolean;
                };
            } & {
                productId: string;
                categoryId: string;
            })[];
        } & {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        })[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    assignCategoriesToProduct(productId: string, names: string[]): Promise<{
        message: string;
        product?: undefined;
    } | {
        message: string;
        product: {
            categorys: ({
                category: {
                    name: string;
                    createdAt: Date;
                    id: string;
                    updatedAt: Date;
                    isDeleted: boolean;
                };
            } & {
                productId: string;
                categoryId: string;
            })[];
        } & {
            description: string;
            name: string;
            price: number;
            stock: number;
            barcode: string;
            sku: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        };
    }>;
    uploadImages(productId: string, images: string[]): Promise<{
        message: string;
    }>;
    deleteCategories(productId: string, categorys: string[]): Promise<{
        message: string;
    }>;
    deteleImages(productId: string, images: string[]): Promise<{
        message: string;
    }>;
    uploadProducts(file: Express.Multer.File): Promise<{
        message: string;
    }>;
    exportToExcel(res: Response): Promise<void>;
}
