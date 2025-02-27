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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const constants_1 = require("../../common/constants");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    findAll(paginationDto2) {
        return this.categoriesService.findAll(paginationDto2);
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    update(id, updateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
    findProducts(id) {
        return this.categoriesService.findProducts(id);
    }
    assignProductsToCategory(categoryId, productIds) {
        return this.categoriesService.assignProductsToCategory(categoryId, productIds);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get one category by id' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a category' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products of a category' }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Get)('product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Assign products to a category' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { productIds: { type: 'array', example: ['1a', '2b'] } },
        },
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Patch)('assign-products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('productIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "assignProductsToCategory", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tienes permisos para acceder a este recurso' }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map