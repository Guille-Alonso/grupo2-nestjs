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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const create_cart_dto_1 = require("./dto/create-cart.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const constants_1 = require("../../common/constants");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const swagger_decorator_1 = require("../../common/decorators/swagger.decorator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    create(createCartDto) {
        return this.cartService.create(createCartDto);
    }
    findAll(req, paginationDto2) {
        const { userId } = req.user;
        return this.cartService.findAll(userId, paginationDto2);
    }
    findAllAdmin(paginationDto2) {
        return this.cartService.findAllAdmin(paginationDto2);
    }
    findOne(id) {
        return this.cartService.findOne(id);
    }
    async update(id, res) {
        try {
            const pdfBuffer = (await this.cartService.comfirmCart(id));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=carrito_confirm.pdf');
            res.status(common_1.HttpStatus.OK).send(pdfBuffer);
        }
        catch (error) {
            console.error(error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Error al generar el PDF',
                error: error.message,
            });
        }
    }
    remove(id) {
        return this.cartService.remove(id);
    }
};
exports.CartController = CartController;
__decorate([
    (0, swagger_1.ApiBody)({ type: create_cart_dto_1.CreateCartDto }),
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Create a new cart',
        bodyType: create_cart_dto_1.CreateCartDto,
        responseStatus: 201,
        responseDescription: 'Cart created',
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cart_dto_1.CreateCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "create", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: "get all the user's carts, need userId",
        responseStatus: 200,
        responseDescription: 'cart found',
    }),
    (0, swagger_1.ApiQuery)({ name: 'id', description: 'User Id', example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findAll", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: "get all carts, need SUPERADMIN rol",
        responseStatus: 200,
        responseDescription: 'cart found',
    }),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Get)("allCart"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findAllAdmin", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: "get one cart",
        responseStatus: 200,
        responseDescription: 'cart found',
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "findOne", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: "confirm a cart",
        responseStatus: 202,
        responseDescription: 'cart found',
    }),
    (0, common_1.Patch)('confirm/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "update", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: "cancel cart",
        responseStatus: 200,
        responseDescription: 'cart found',
    }),
    (0, common_1.Delete)('cancel/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "remove", null);
exports.CartController = CartController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.USER, constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map