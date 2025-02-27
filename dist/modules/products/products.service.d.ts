import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ExcelService } from 'src/modules/excel/excel.service';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { AwsService } from '../aws/aws.service';
export declare class ProductsService {
    private readonly prisma;
    private readonly excelService;
    private readonly i18n;
    private readonly paginationService;
    private readonly awsService;
    constructor(prisma: PrismaService, excelService: ExcelService, i18n: I18nService, paginationService: PaginationService, awsService: AwsService);
    create(newProduct: CreateProductDto): Promise<{
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
    filterProducts(query: FilterProductsDto): Promise<{
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
    uploadProducts(buffer: Buffer): Promise<{
        message: string;
    }>;
    exportToExcel(res: Response): Promise<void>;
}
