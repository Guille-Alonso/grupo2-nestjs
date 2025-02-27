import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { Response } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(createCartDto: CreateCartDto): Promise<{
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
    findAll(req: any, paginationDto2: PaginationDto2): Promise<{
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
    update(id: string, res: Response): Promise<void>;
    remove(id: string): Promise<{
        Message: unknown;
    }>;
}
