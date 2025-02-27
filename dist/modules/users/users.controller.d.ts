import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/utils/pagination/dto//pagination.dto';
import { I18nService } from 'nestjs-i18n';
import { CreateProfileDto } from './dto/create-profile.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly i18n;
    constructor(usersService: UsersService, i18n: I18nService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        userId: string;
    }>;
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
    updateUserProfile(req: any, createProfileDto: CreateProfileDto, file?: Express.Multer.File): Promise<{
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
    uploadUsers(file: Express.Multer.File): Promise<any>;
}
