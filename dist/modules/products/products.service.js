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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const excel_service_1 = require("../excel/excel.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const pagination_service_1 = require("../../utils/pagination/pagination.service");
const aws_service_1 = require("../aws/aws.service");
let ProductsService = class ProductsService {
    constructor(prisma, excelService, i18n, paginationService, awsService) {
        this.prisma = prisma;
        this.excelService = excelService;
        this.i18n = i18n;
        this.paginationService = paginationService;
        this.awsService = awsService;
    }
    async create(newProduct) {
        try {
            const { categoryIds, images, ...productData } = newProduct;
            const categorys = this.prisma.category.findMany({
                where: {
                    id: { in: categoryIds },
                },
            });
            const existingCategoryIds = (await categorys).map((p) => p.id);
            const product = await this.prisma.product.create({
                data: {
                    ...productData,
                    images: {
                        create: {
                            colection: images,
                        },
                    },
                    categorys: categoryIds
                        ? {
                            create: existingCategoryIds.map((id) => ({
                                category: { connect: { id } },
                            })),
                        }
                        : undefined,
                },
                include: { categorys: true },
            });
            return { message: this.i18n.t('messages.productCreated'), product };
        }
        catch (error) {
            const message = this.i18n.t('messages.productNotCreated') + error;
            throw new Error(message);
        }
    }
    async findAll(paginationDto2) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto2;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.product.findMany({
                    where: {
                        isDeleted: false,
                    },
                    skip,
                    take,
                    orderBy,
                }),
                this.prisma.product.count(),
            ]);
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotFound') + error;
            throw new Error(message);
        }
    }
    async findOne(id) {
        try {
            const product = await this.prisma.product.findUnique({
                where: {
                    id,
                    isDeleted: false,
                },
                include: { categorys: { include: { category: true } }, images: true },
            });
            return product;
        }
        catch (error) {
            const message = this.i18n.t('messages.productNotFound') + error;
            throw new Error(message);
        }
    }
    async update(id, updateProductDto) {
        try {
            const { categoryIds, images, ...productData } = updateProductDto;
            const updatedProduct = await this.prisma.product.update({
                where: {
                    id,
                },
                data: {
                    ...productData,
                    images: {
                        update: {
                            colection: images,
                        },
                    },
                    categorys: categoryIds
                        ? {
                            create: categoryIds.map((id) => ({
                                category: { connect: { id } },
                            })),
                        }
                        : undefined,
                },
                include: { categorys: true },
            });
            return {
                message: this.i18n.t('messages.productUpdated'),
                updatedProduct,
            };
        }
        catch (error) {
            const message = this.i18n.t('messages.productNotCreated') + error;
            throw new Error(message);
        }
    }
    async remove(id) {
        try {
            const deleteProduct = await this.prisma.product.update({
                where: {
                    id,
                },
                data: {
                    isDeleted: true,
                    images: {
                        update: {
                            isDeleted: true,
                        },
                    },
                },
            });
            return { message: this.i18n.t('messages.productDeleted'), deleteProduct };
        }
        catch (error) {
            const message = this.i18n.t('messages.productNotDeleted') + error;
            throw new Error(message);
        }
    }
    async filterProducts(query) {
        try {
            const { name, sku, minPrice, maxPrice, category, page, pageSize, sortBy, sortOrder, } = query;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const where = {
                isDeleted: false,
                name: name
                    ? { contains: name, mode: 'insensitive' }
                    : undefined,
                sku: sku ? { equals: sku } : undefined,
                price: {
                    gte: minPrice ?? undefined,
                    lte: maxPrice ?? undefined,
                },
                categorys: category
                    ? {
                        some: {
                            category: {
                                name: {
                                    contains: category,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    }
                    : undefined,
            };
            const [data, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        images: true,
                        categorys: { include: { category: true } },
                    },
                }),
                this.prisma.product.count({ where }),
            ]);
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotFound') + error;
            throw new Error(message);
        }
    }
    async assignCategoriesToProduct(productId, names) {
        try {
            const categorys = await this.prisma.category.findMany({
                where: {
                    name: { in: names },
                },
                select: {
                    id: true,
                },
            });
            const existingCategoryIds = categorys.map((p) => p.id);
            const productCategories = await this.prisma.productOnCategory.findMany({
                where: {
                    productId: productId,
                    categoryId: { in: existingCategoryIds },
                },
                select: { categoryId: true },
            });
            const assignedCategoryIds = productCategories.map((pc) => pc.categoryId);
            const newCategoryIds = existingCategoryIds.filter((id) => !assignedCategoryIds.includes(id));
            if (newCategoryIds.length === 0) {
                return { message: this.i18n.t('messages.notNewCategorys') };
            }
            await this.prisma.productOnCategory.createMany({
                data: newCategoryIds.map((categoryId) => ({
                    productId,
                    categoryId,
                })),
                skipDuplicates: true,
            });
            return {
                message: this.i18n.t('messages.categorysAssigned'),
                product: await this.prisma.product.findUnique({
                    where: { id: productId },
                    include: { categorys: { include: { category: true } } },
                }),
            };
        }
        catch (error) {
            const message = this.i18n.t('messages.categorysNotAssigned') + error;
            throw new Error(message);
        }
    }
    async uploadImages(productId, images) {
        try {
            const assignedImages = await this.prisma.image.findMany({
                where: {
                    productId: productId,
                },
                select: { colection: true },
            });
            const colection = assignedImages[0].colection;
            const newColection = images.filter((item) => !colection.includes(item));
            if (newColection.length === 0) {
                return { message: this.i18n.t('messages.notNewImages') };
            }
            await this.prisma.image.update({
                where: { productId },
                data: {
                    colection: {
                        push: newColection,
                    },
                },
            });
            return { message: this.i18n.t('messages.imagesUploaded') };
        }
        catch (error) {
            const message = this.i18n.t('messages.imagesNotUploaded') + error;
            throw new Error(message);
        }
    }
    async deleteCategories(productId, categorys) {
        try {
            await this.prisma.productOnCategory.deleteMany({
                where: {
                    productId: productId,
                    categoryId: { in: categorys },
                },
            });
            return { message: this.i18n.t('messages.categorysDeleted') };
        }
        catch (error) {
            const message = this.i18n.t('messages.categorysNotDeleted') + error;
            throw new Error(message);
        }
    }
    async deteleImages(productId, images) {
        try {
            await this.prisma.image.update({
                where: { productId },
                data: {
                    colection: {
                        set: images,
                    },
                },
            });
            return { message: this.i18n.t('messages.imagesDeleted') };
        }
        catch (error) {
            const message = this.i18n.t('messages.imagesNotDeleted') + error;
            throw new Error(message);
        }
    }
    async uploadProducts(buffer) {
        try {
            const products = await this.excelService.readExcel(buffer);
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                const productNew = {
                    ...product,
                    price: parseFloat(product.price),
                };
                await this.create(productNew);
            }
            return { message: this.i18n.t('messages.productsUploaded') };
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotUploaded') + error;
            throw new Error(message);
        }
    }
    async exportToExcel(res) {
        try {
            const products = await this.prisma.product.findMany({
                where: {
                    isDeleted: false,
                },
                include: { categorys: { include: { category: true } }, images: true },
            });
            const columns = [
                { header: 'Name', key: 'name' },
                { header: 'Description', key: 'description' },
                { header: 'Price', key: 'price' },
                { header: 'Stock', key: 'stock' },
                { header: 'Barcode', key: 'barcode' },
                { header: 'SKU', key: 'sku' },
                { header: 'Categorys', key: 'categorys' },
                { header: 'Images', key: 'images' },
            ];
            const workbook = await this.excelService.generateExcel(products, columns, 'Productos');
            return this.excelService.exportToResponse(res, workbook, 'productos.xlsx');
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotExported') + error;
            throw new Error(message);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        excel_service_1.ExcelService,
        nestjs_i18n_1.I18nService,
        pagination_service_1.PaginationService,
        aws_service_1.AwsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map