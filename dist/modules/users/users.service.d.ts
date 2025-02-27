import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelService } from '../excel/excel.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';
import { MessagingService } from '../messanging/messanging.service';
import { CreateProfileDto } from './dto/create-profile.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly awsService;
    private readonly excelService;
    private readonly i18n;
    private messagingService;
    constructor(prisma: PrismaService, awsService: AwsService, excelService: ExcelService, i18n: I18nService, messagingService: MessagingService);
    create(user: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    findAll(): Promise<{
        name: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        isDeleted: boolean;
        email: string;
        password: string;
        isActive: boolean;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    findAllUserWithPagination(pagination: PaginationDto): Promise<{
        data: any;
        total: any;
        page: any;
        perPage: any;
        cantPages: number;
    }>;
    findOne(id: string): Promise<{
        name: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        isDeleted: boolean;
        email: string;
        password: string;
        isActive: boolean;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: {
            name: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            email: string;
            password: string;
            isActive: boolean;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        user: {
            name: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            email: string;
            password: string;
            isActive: boolean;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    private extractFileKeyFromUrl;
    updateUserProfile(id: string, createProfileDto: CreateProfileDto, file?: Express.Multer.File): Promise<{
        message: string;
        profile: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            userId: string;
            address: string;
            phone: string;
            photo: string;
        };
    }>;
    exportAllExcel(res: Response): Promise<void>;
    uploadUsers(buffer: Buffer): Promise<{
        created: number;
        duplicated: number;
        validationErrors: number;
    }>;
}
