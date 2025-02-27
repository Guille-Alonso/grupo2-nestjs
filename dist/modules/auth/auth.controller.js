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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const auth_dto_1 = require("./dto/auth.dto");
const jwt_guard_1 = require("./guards/jwt.guard");
const register_dto_1 = require("./dto/register.dto");
const swagger_decorator_1 = require("../../common/decorators/swagger.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(user) {
        return await this.authService.register(user);
    }
    async login(credentials) {
        return await this.authService.login(credentials);
    }
    async recoveryPassword(recoverDto) {
        return await this.authService.recoveryPassword(recoverDto);
    }
    async resetPassword(resetDto, req) {
        const id = req.user.userId;
        return await this.authService.resetPassword(resetDto, id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Register a new user',
        bodyType: register_dto_1.RegisterUserDto,
        responseStatus: 200,
        responseDescription: 'User register successfully',
    }),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Log in user',
        bodyType: login_dto_1.LoginAuthDto,
        responseStatus: 200,
        responseDescription: 'Logged in user',
    }),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Recovery Password',
        bodyType: auth_dto_1.RecoverPasswordDto,
        responseStatus: 200,
        responseDescription: 'Recovery email sent',
    }),
    (0, common_1.Post)('/recovery-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RecoverPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "recoveryPassword", null);
__decorate([
    (0, swagger_decorator_1.ApiCustomOperation)({
        summary: 'Reset Password',
        bodyType: auth_dto_1.ResetPasswordDto,
        responseStatus: 200,
        responseDescription: 'Password successfully changed',
    }),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/reset-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map