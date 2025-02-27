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
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("./images.service");
const create_image_dto_1 = require("./dto/create-image.dto");
const update_image_dto_1 = require("./dto/update-image.dto");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const constants_1 = require("../../common/constants");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
let ImagesController = class ImagesController {
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    create(createImageDto) {
        return this.imagesService.create(createImageDto);
    }
    findAll(paginationDto2) {
        return this.imagesService.findAll(paginationDto2);
    }
    findOne(id) {
        return this.imagesService.findOne(id);
    }
    update(id, updateImageDto) {
        return this.imagesService.update(id, updateImageDto);
    }
    remove(id) {
        return this.imagesService.remove(id);
    }
    async assignImage(files, productId) {
        return await this.imagesService.assignImage(files, productId);
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create image' }),
    (0, swagger_1.ApiBody)({ type: create_image_dto_1.CreateImageDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_image_dto_1.CreateImageDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "create", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findAll", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get image by id' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update image' }),
    (0, swagger_1.ApiBody)({ type: update_image_dto_1.UpdateImageDto }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_image_dto_1.UpdateImageDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "update", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "remove", null);
__decorate([
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assign image to product' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'productId', type: 'string' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.Post)('assignimage/:productId'),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "assignImage", null);
exports.ImagesController = ImagesController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map