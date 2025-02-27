import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';
export declare class CategoriesService {
    private readonly prisma;
    private readonly paginationService;
    private readonly i18n;
    constructor(prisma: PrismaService, paginationService: PaginationService, i18n: I18nService);
    create(createCategoryDto: CreateCategoryDto): Promise<string | Error>;
    findAll(paginationDto: PaginationDto2): Promise<{
        data: {
            name: string;
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
        name: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        isDeleted: boolean;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<string>;
    remove(id: string): Promise<{
        message: string;
        category: {
            name: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
        };
    }>;
    findProducts(id: string): Promise<string[]>;
    assignProductsToCategory(categoryId: string, productIds: string[]): Promise<{
        message: string;
    }>;
}
