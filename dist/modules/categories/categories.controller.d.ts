import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<string | Error>;
    findAll(paginationDto2: PaginationDto2): Promise<{
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
