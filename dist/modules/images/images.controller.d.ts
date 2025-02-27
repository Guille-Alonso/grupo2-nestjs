import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    create(createImageDto: CreateImageDto): Promise<string>;
    findAll(paginationDto2: PaginationDto2): Promise<{
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
