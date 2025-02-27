"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const pagination_service_1 = require("../../utils/pagination/pagination.service");
const printer_service_1 = require("../printer/printer.service");
const documents_1 = require("../printer/documents");
let CartService = class CartService {
    constructor(prisma, i18n, paginationService, printerService) {
        this.prisma = prisma;
        this.i18n = i18n;
        this.paginationService = paginationService;
        this.printerService = printerService;
    }
    async recoverCartData(cartId) {
        const cartData = await this.prisma.cart.findUnique({
            where: {
                id: cartId,
                isDeleted: false,
            },
            select: {
                totalAmount: true,
                state: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                cartLine: {
                    select: {
                        unit_price: true,
                        total_price: true,
                        quantity: true,
                        product: {
                            select: {
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
        return cartData;
    }
    async create(cart) {
        try {
            let subtotal = 0;
            for (const product of cart.cartLine) {
                const prod = await this.prisma.product.findUnique({
                    where: {
                        id: product.productId,
                    },
                });
                const total = product.quantity * prod.price;
                subtotal = subtotal + total;
            }
            console.log(subtotal);
            const newCart = await this.prisma.$transaction(async (tx) => {
                const carrito = await tx.cart.create({
                    data: {
                        userId: cart.userId,
                        totalAmount: subtotal,
                    },
                });
                for (const product of cart.cartLine) {
                    const exist = await tx.product.findUnique({
                        where: {
                            id: product.productId,
                        },
                    });
                    if (!exist) {
                        throw new Error(this.i18n.t('messages.productNotFound') + common_1.HttpStatus.BAD_REQUEST);
                    }
                    let totalPrice = product.quantity * exist.price;
                    await tx.cartLine.create({
                        data: {
                            cartId: carrito.id,
                            productId: product.productId,
                            quantity: product.quantity,
                            unit_price: exist.price,
                            total_price: totalPrice,
                        },
                    });
                }
                return carrito;
            });
            return { newCart };
        }
        catch (e) {
            throw new Error(e.message + common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(userId, paginationDto2) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto2;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.cart.findMany({
                    where: {
                        userId,
                        isDeleted: false,
                    },
                    select: {
                        id: true,
                        totalAmount: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                        cartLine: {
                            select: {
                                quantity: true,
                                unit_price: true,
                                total_price: true,
                                product: {
                                    select: {
                                        name: true,
                                        description: true,
                                    },
                                },
                            },
                            skip,
                            take,
                            orderBy,
                        },
                    },
                }),
                this.prisma.cart.count(),
            ]);
            if (data.length === 0) {
                throw new Error(this.i18n.t('messages.cartsNotFind') + common_1.HttpStatus.BAD_REQUEST);
            }
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (e) {
            const message = this.i18n.t('messages.cartsNotFind') + e;
            throw new Error(message);
        }
    }
    async findAllAdmin(paginationDto2) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto2;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.cart.findMany({
                    select: {
                        id: true,
                        totalAmount: true,
                        state: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    skip,
                    take,
                    orderBy,
                }),
                this.prisma.cart.count(),
            ]);
            if (data.length === 0) {
                throw new Error(this.i18n.t('messages.cartsNotFind') + common_1.HttpStatus.BAD_REQUEST);
            }
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (e) {
            const message = this.i18n.t('messages.cartsNotFind') + ' ' + e;
            throw new Error(message);
        }
    }
    findOne(id) {
        try {
            const datita = this.recoverCartData(id);
            if (!datita) {
                throw new Error(this.i18n.t('messages.cartNotFind'));
            }
            return datita;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async comfirmCart(id) {
        try {
            const carrito = await this.prisma.cart.findUnique({
                where: { id, state: "PENDING" },
                include: { user: true, cartLine: { include: { product: true }, } },
            });
            if (!carrito) {
                throw new Error(this.i18n.t('messages.cartsNotFind'));
            }
            await this.prisma.$transaction(async (tx) => {
                const productCart = carrito.cartLine;
                for (const line of productCart) {
                    const productStock = await tx.product.findUnique({
                        where: { id: line.product.id },
                        select: { stock: true, name: true },
                    });
                    if (productStock.stock <= 0) {
                        throw new Error(`${this.i18n.t('nessages.cartProductNoExist')}: ${productStock.name}`);
                    }
                    await tx.product.update({
                        where: { id: line.product.id },
                        data: { stock: { decrement: line.quantity } },
                    });
                }
                await tx.cart.update({
                    where: { id },
                    data: { state: "CONFIRMED" },
                });
            });
            const pdfConfirm = await (0, documents_1.CarritoConfirmPdf)(carrito);
            const pdfDoc = await this.printerService.createPdf(pdfConfirm);
            return pdfDoc;
        }
        catch (e) {
            if (e.message === 'cart no find') {
                throw new common_1.NotFoundException(e.message);
            }
            else if (e.message.startsWith('producto ')) {
                throw new common_1.BadRequestException(e.message);
            }
            else {
                common_1.Logger.error(e);
                throw new common_1.InternalServerErrorException(this.i18n.t('noConfirmCart'));
            }
        }
    }
    async remove(id) {
        try {
            const carrito = await this.prisma.cart.findUnique({
                where: {
                    id,
                    state: 'PENDING',
                },
            });
            if (!carrito) {
                throw new Error('cart confirm');
            }
            await this.prisma.cart.update({
                where: {
                    id,
                    state: 'PENDING',
                },
                data: {
                    state: 'CANCELLED',
                },
            });
            return { Message: this.i18n.t('cartCancel') };
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_i18n_1.I18nService,
        pagination_service_1.PaginationService,
        printer_service_1.PrinterService])
], CartService);
//# sourceMappingURL=cart.service.js.map