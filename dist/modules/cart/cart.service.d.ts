import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PrinterService } from '../printer/printer.service';
export declare class CartService {
    private readonly prisma;
    private readonly i18n;
    private readonly paginationService;
    private readonly printerService;
    constructor(prisma: PrismaService, i18n: I18nService, paginationService: PaginationService, printerService: PrinterService);
    recoverCartData(cartId: string): Promise<{
        user: {
            name: string;
            email: string;
        };
        cartLine: {
            product: {
                description: string;
                name: string;
            };
            quantity: number;
            total_price: number;
            unit_price: number;
        }[];
        state: import(".prisma/client").$Enums.State;
        totalAmount: number;
    }>;
    create(cart: CreateCartDto): Promise<{
        newCart: {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            userId: string;
            state: import(".prisma/client").$Enums.State;
            totalAmount: number;
        };
    }>;
    findAll(userId: any, paginationDto2: any): Promise<{
        data: {
            user: {
                name: string;
                email: string;
            };
            cartLine: {
                product: {
                    description: string;
                    name: string;
                };
                quantity: number;
                total_price: number;
                unit_price: number;
            }[];
            id: string;
            totalAmount: number;
        }[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findAllAdmin(paginationDto2: PaginationDto2): Promise<{
        data: {
            user: {
                name: string;
                email: string;
            };
            id: string;
            state: import(".prisma/client").$Enums.State;
            totalAmount: number;
        }[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            name: string;
            email: string;
        };
        cartLine: {
            product: {
                description: string;
                name: string;
            };
            quantity: number;
            total_price: number;
            unit_price: number;
        }[];
        state: import(".prisma/client").$Enums.State;
        totalAmount: number;
    }>;
    comfirmCart(id: string): Promise<Buffer>;
    remove(id: string): Promise<{
        Message: unknown;
    }>;
}
