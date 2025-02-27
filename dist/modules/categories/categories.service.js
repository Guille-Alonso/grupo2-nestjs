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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../../utils/pagination/pagination.service");
const nestjs_i18n_1 = require("nestjs-i18n");
let CategoriesService = class CategoriesService {
    constructor(prisma, paginationService, i18n) {
        this.prisma = prisma;
        this.paginationService = paginationService;
        this.i18n = i18n;
    }
    async create(createCategoryDto) {
        try {
            const category = await this.prisma.category.create({
                data: {
                    name: createCategoryDto.name,
                },
            });
            const message = this.i18n.t('messages.categoryCreated') + '\n' + JSON.stringify(category, null, 2);
            return message;
        }
        catch (error) {
            const message = this.i18n.t('messages.categoryNotCreated') + error.message;
            return new Error(message);
        }
    }
    async findAll(paginationDto) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto;
            console.log(paginationDto, page, pageSize, sortBy, sortOrder);
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.category.findMany({
                    where: {
                        isDeleted: false,
                    },
                    skip,
                    take,
                    orderBy,
                }),
                this.prisma.category.count(),
            ]);
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (error) {
            const message = this.i18n.t('messages.categoriesNotFound') + error.message;
            throw new Error(message);
        }
    }
    async findOne(id) {
        try {
            const category = await this.prisma.category.findUnique({
                where: {
                    id,
                    isDeleted: false,
                },
            });
            return category;
        }
        catch (error) {
            const message = this.i18n.t('messages.categoryNotFound') + error.message;
            throw new Error(message);
        }
    }
    async update(id, updateCategoryDto) {
        try {
            const category = await this.prisma.category.update({
                where: {
                    id,
                },
                data: updateCategoryDto,
            });
            const message = this.i18n.t('messages.categoryUpdated') + category;
            return message;
        }
        catch (error) {
            const message = this.i18n.t('messages.categoryNotUpdated') + error.message;
            throw new Error(message);
        }
    }
    async remove(id) {
        try {
            const category = await this.prisma.category.update({
                where: {
                    id,
                },
                data: {
                    isDeleted: true,
                },
            });
            const message = this.i18n.t('messages.categoryDeleted');
            return {
                message,
                category
            };
        }
        catch (error) {
            const message = this.i18n.t('messages.categoryNotDeleted') + error.message;
            throw new Error(message);
        }
    }
    async findProducts(id) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    products: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            if (!category || category.products.length === 0) {
                const message = this.i18n.t('messages.productsNotFound');
                throw new Error(message);
            }
            return category.products.map((relation) => relation.product.name);
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotFound') + error.message;
            throw new Error(message);
        }
    }
    async assignProductsToCategory(categoryId, productIds) {
        try {
            const category = await this.prisma.category.update({
                where: { id: categoryId },
                data: {
                    products: {
                        create: productIds.map((productId) => ({
                            product: { connect: { id: productId } },
                        })),
                    },
                },
                include: { products: { include: { product: true } } },
            });
            const message = this.i18n.t('messages.categoryUpdated') + category.products;
            return { message };
        }
        catch (error) {
            const message = this.i18n.t('messages.categoryNotUpdated') + error.message;
            throw new Error(message);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.PaginationService,
        nestjs_i18n_1.I18nService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map