import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { I18nService } from 'nestjs-i18n';
import { AwsService } from '../aws/aws.service';
export declare class ImagesService {
    private readonly prisma;
    private readonly paginationService;
    private readonly i18n;
    private readonly awsService;
    constructor(prisma: PrismaService, paginationService: PaginationService, i18n: I18nService, awsService: AwsService);
    create(createImageDto: CreateImageDto): Promise<string>;
    findAll(paginationDto: PaginationDto2): Promise<{
        data: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            colection: string[];
            productId: string;
        }[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, updateImageDto: UpdateImageDto): Promise<string>;
    remove(id: string): Promise<{
        message: string;
        deleteImage: {
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
    assignImage(files: Express.Multer.File[], productId: string): Promise<string>;
}
