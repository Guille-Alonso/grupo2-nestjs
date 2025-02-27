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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../common/constants");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
const platform_express_1 = require("@nestjs/platform-express");
const filter_product_dto_1 = require("./dto/filter-product.dto");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll(paginationDto2) {
        return this.productsService.findAll(paginationDto2);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
    filter(filter) {
        return this.productsService.filterProducts(filter);
    }
    assignCategoriesToProduct(productId, names) {
        return this.productsService.assignCategoriesToProduct(productId, names);
    }
    uploadImages(productId, images) {
        return this.productsService.uploadImages(productId, images);
    }
    deleteCategories(productId, categorys) {
        return this.productsService.deleteCategories(productId, categorys);
    }
    deteleImages(productId, images) {
        return this.productsService.deteleImages(productId, images);
    }
    async uploadProducts(file) {
        const data = await this.productsService.uploadProducts(file.buffer);
        return data;
    }
    async exportToExcel(res) {
        return this.productsService.exportToExcel(res);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a product' }),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get a product' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product' }),
    (0, swagger_1.ApiBody)({ type: update_product_dto_1.UpdateProductDto }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Filter products' }),
    (0, common_1.Post)('filter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_product_dto_1.FilterProductsDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "filter", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Assign categories to a product' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                names: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Electronics', 'Computers'],
                },
            },
        },
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)('assign-categories/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('names')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "assignCategoriesToProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload images to a product' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'https://example.com/image1.jpg',
                        'https://example.com/image2.jpg',
                    ],
                },
            },
        },
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)('upload-images/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('images')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "uploadImages", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete categories from a product' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                categorys: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Electronics', 'Computers'],
                },
            },
        },
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)('delete-categories/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('categorys')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete images from a product' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'https://example.com/image1.jpg',
                        'https://example.com/image2.jpg',
                    ],
                },
            },
        },
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)('delete-images/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('images')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deteleImages", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a excel file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a excel file' }),
    (0, common_1.Post)('upload/excel'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadProducts", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Export products to excel' }),
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Response]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "exportToExcel", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map