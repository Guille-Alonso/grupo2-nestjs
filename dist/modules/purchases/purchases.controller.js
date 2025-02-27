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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const purchases_service_1 = require("./purchases.service");
const create_purchase_dto_1 = require("./dto/create-purchase.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorators_1 = require("../../common/decorators/roles.decorators");
const constants_1 = require("../../common/constants");
const swagger_decorator_1 = require("../../common/decorators/swagger.decorator");
const swagger_1 = require("@nestjs/swagger");
let PurchasesController = class PurchasesController {
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    async create(createPurchaseDto, req, res) {
        const { userId } = req.user;
        try {
            const pdfBuffer = (await this.purchasesService.create(createPurchaseDto, userId));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=purchase.pdf');
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
    findAll(req) {
        const { userId } = req.user;
        return this.purchasesService.findAll(userId);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Create a new purchases, need SUPERADMIN rol',
        bodyType: create_purchase_dto_1.CreatePurchaseDto,
        responseStatus: 201,
        responseDescription: 'purchases created created',
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_dto_1.CreatePurchaseDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "create", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'get all purchases',
        responseStatus: 201,
        responseDescription: 'purchases',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasesController.prototype, "findAll", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorators_1.Roles)(constants_1.RoleEnum.SUPERADMIN),
    (0, common_1.Controller)('purchases'),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map