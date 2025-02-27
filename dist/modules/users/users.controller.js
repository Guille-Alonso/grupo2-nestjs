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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const constants_1 = require("../../common/constants");
const roles_guard_1 = require("../auth/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_decorator_1 = require("../../common/decorators/swagger.decorator");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const custom_error_1 = __importDefault(require("../../utils/custom.error"));
const nestjs_i18n_1 = require("nestjs-i18n");
const create_profile_dto_1 = require("./dto/create-profile.dto");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    constructor(usersService, i18n) {
        this.usersService = usersService;
        this.i18n = i18n;
    }
    async create(createUserDto) {
        return await this.usersService.create(createUserDto);
    }
    async findAllUserWithPagination(pagination) {
        return await this.usersService.findAllUserWithPagination(pagination);
    }
    async findOne(id) {
        return await this.usersService.findOne(id);
    }
    async update(id, updateUserDto) {
        return await this.usersService.update(id, updateUserDto);
    }
    async remove(id) {
        return await this.usersService.remove(id);
    }
    async updateUserProfile(req, createProfileDto, file) {
        const { userId } = req.user;
        return await this.usersService.updateUserProfile(userId, createProfileDto, file);
    }
    async exportAllExcel(res) {
        return await this.usersService.exportAllExcel(res);
    }
    async uploadUsers(file) {
        try {
            if (!file) {
                throw new custom_error_1.default(this.i18n.t('messages.fileNotProvided'), common_1.HttpStatus.BAD_REQUEST);
            }
            const data = await this.usersService.uploadUsers(file.buffer);
            return data;
        }
        catch (error) {
            return error?.message;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Create a new user',
        bodyType: create_user_dto_1.CreateUserDto,
        responseStatus: 200,
        responseDescription: 'User created successfully',
    }),
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Get all users',
        responseStatus: 200,
        responseDescription: 'Return all users',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllUserWithPagination", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Get one user',
        responseStatus: 200,
        responseDescription: 'Return one user',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Update a user',
        bodyType: create_user_dto_1.CreateUserDto,
        responseStatus: 200,
        responseDescription: 'Updated user',
    }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Delete a user',
        responseStatus: 200,
        responseDescription: 'Deleted user',
    }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Update/Created user profile',
        bodyType: create_profile_dto_1.CreateProfileDto,
        responseStatus: 200,
        responseDescription: 'Updated user profile',
    }),
    (0, common_1.Post)('update/profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_profile_dto_1.CreateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserProfile", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Get all users in excel',
        responseStatus: 200,
        responseDescription: 'Return all users',
    }),
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Response]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "exportAllExcel", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Upload users from excel',
        responseStatus: 200,
        responseDescription: 'Imported users',
    }),
    (0, common_1.Post)('upload/excel'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadUsers", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService, nestjs_i18n_1.I18nService])
], UsersController);
//# sourceMappingURL=users.controller.js.map