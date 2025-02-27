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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const printer_service_1 = require("../printer/printer.service");
const documents_1 = require("../printer/documents");
let PurchasesService = class PurchasesService {
    constructor(prisma, i18n, printerService) {
        this.prisma = prisma;
        this.i18n = i18n;
        this.printerService = printerService;
    }
    async create(createPurchaseDto, userId) {
        let idPurchase;
        try {
            let total = 0;
            for (const produ of createPurchaseDto.productPurchase) {
                total = total + produ.product.stock * produ.product.price;
            }
            await this.prisma.$transaction(async (tx) => {
                const purchase = await tx.purchase.create({
                    data: {
                        userId,
                        total
                    }
                });
                idPurchase = purchase.id;
                for (const product of createPurchaseDto.productPurchase) {
                    const exist = await tx.product.findFirst({
                        where: {
                            OR: [
                                { name: product.product.name },
                                { barcode: product.product.barcode }
                            ]
                        }
                    });
                    if (exist) {
                        await tx.product.update({
                            where: {
                                id: exist.id,
                            },
                            data: {
                                stock: { increment: product.product.stock }
                            }
                        });
                        await tx.productPurchase.create({
                            data: {
                                productId: exist.id,
                                purchaseId: purchase.id,
                                quantity: product.product.stock
                            }
                        });
                    }
                    else {
                        const { name, description, price, stock, barcode, sku } = product.product;
                        const newProduct = await tx.product.create({
                            data: {
                                name, description, price, stock, barcode, sku
                            }
                        });
                        tx.productPurchase.create({
                            data: {
                                purchaseId: purchase.id,
                                productId: newProduct.id,
                                quantity: product.product.stock
                            }
                        });
                    }
                }
            });
            const purchset = await this.prisma.purchase.findUnique({
                where: {
                    id: idPurchase
                },
                include: { user: true, products: { include: { product: true } } }
            });
            const pdfDetail = await (0, documents_1.detalleCompra)(purchset);
            const pdfDoc = await this.printerService.createPdf(pdfDetail);
            return pdfDoc;
        }
        catch (e) {
            throw new Error(e + " " + common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(userId) {
        try {
            const datita = await this.prisma.purchase.findMany({
                where: {
                    userId
                },
                include: { user: true, products: { include: { product: true } } }
            });
            const setear = [];
            for (const purchases of datita) {
                const purchaseData = {
                    userId: purchases.user.id,
                    users: purchases.user.name + " " + purchases.user.lastName,
                    fecha: purchases.createdAt.getDate() + "-" + purchases.createdAt.getMonth() + "-" + purchases.createdAt.getFullYear(),
                    hora: purchases.createdAt.getHours() + ":" + purchases.createdAt.getMinutes() + ":" + purchases.createdAt.getSeconds(),
                    total: purchases.total,
                    products: []
                };
                for (const Prod of purchases.products) {
                    let product = 'productId: ' + Prod.product.id + ', quantity: ' + Prod.quantity + ', product name: ' + Prod.product.name + ', product price: ' + Prod.product.price + '.';
                    purchaseData.products.push(product);
                }
                setear.push(purchaseData);
            }
            return setear;
        }
        catch (e) {
            throw new Error(e + " " + common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_i18n_1.I18nService,
        printer_service_1.PrinterService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map