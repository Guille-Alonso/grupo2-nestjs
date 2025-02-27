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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const encryption_1 = require("../../utils/encryption");
const messanging_service_1 = require("../messanging/messanging.service");
const constants_1 = require("../../common/constants");
const custom_error_1 = __importDefault(require("../../utils/custom.error"));
const nestjs_i18n_1 = require("nestjs-i18n");
let AuthService = class AuthService {
    constructor(prisma, jwtService, messagingService, i18n) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.messagingService = messagingService;
        this.i18n = i18n;
    }
    async register(user) {
        try {
            if (!user.email || !user.password || !user.name || !user.lastName) {
                const message = this.i18n.t('messages.incompleteRegister');
                throw new custom_error_1.default(message, common_1.HttpStatus.BAD_REQUEST);
            }
            const userExists = await this.prisma.user.findFirst({
                where: {
                    email: {
                        equals: user.email,
                        mode: 'insensitive',
                    },
                },
            });
            if (userExists) {
                const message = this.i18n.t('messages.existingEmail');
                throw new custom_error_1.default(message, common_1.HttpStatus.CONFLICT);
            }
            const hashedPassword = await (0, encryption_1.hashPassword)(user.password);
            const email = user.email.toLowerCase();
            const newUser = await this.prisma.user.create({
                data: {
                    ...user,
                    email,
                    password: hashedPassword,
                },
            });
            try {
                await this.messagingService.sendRegisterUserEmail({
                    from: constants_1.messagingConfig.emailSender,
                    to: email,
                    name: user.name
                });
            }
            catch (emailError) {
                const message = this.i18n.t('messages.sendEmailError');
                throw new custom_error_1.default(message, common_1.HttpStatus.CREATED);
            }
            const message = this.i18n.t('messages.successfulRegistration');
            return {
                message,
                userId: newUser.id,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionRegister = this.i18n.t('messages.messageActionRegister');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionRegister },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(credentials) {
        try {
            const { password } = credentials;
            const findUser = await this.prisma.user.findFirst({
                where: {
                    email: {
                        equals: credentials.email,
                        mode: 'insensitive',
                    },
                    isDeleted: false,
                    isActive: true
                },
                include: {
                    profile: {
                        where: {
                            isDeleted: false,
                        },
                    },
                }
            });
            if (!findUser) {
                const message = this.i18n.t('messages.unauthorized');
                throw new custom_error_1.default(message, common_1.HttpStatus.UNAUTHORIZED);
            }
            const isCorrectPassword = await (0, encryption_1.comparePassword)(password, findUser.password);
            if (!isCorrectPassword) {
                const message = this.i18n.t('messages.unauthorized');
                throw new custom_error_1.default(message, common_1.HttpStatus.UNAUTHORIZED);
            }
            const payload = {
                id: findUser.id,
                email: findUser.email,
                role: findUser.role,
            };
            const token = await (0, encryption_1.createTokens)(payload, this.jwtService);
            return {
                user: findUser,
                token,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionLogin = this.i18n.t('messages.messageActionLogin');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionLogin },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async recoveryPassword(recoverDto) {
        try {
            const findUser = await this.prisma.user.findFirst({
                where: {
                    email: {
                        equals: recoverDto.email,
                        mode: 'insensitive',
                    },
                },
            });
            if (!findUser) {
                const message = this.i18n.t('messages.userNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            const payload = {
                id: findUser.id,
                email: findUser.email,
                role: findUser.role,
            };
            const { accessToken } = await (0, encryption_1.createTokens)(payload, this.jwtService);
            if (!accessToken) {
                const messageActionRecoveryPassword = this.i18n.t('messages.messageActionRecoveryPassword');
                const message = this.i18n.t('messages.genericError', {
                    args: { action: messageActionRecoveryPassword },
                });
                throw new custom_error_1.default(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            await this.messagingService.sendRecoveryPassword({
                from: constants_1.messagingConfig.emailSender,
                to: findUser.email,
                url: `${constants_1.messagingConfig.resetPasswordUrls.backoffice}/${accessToken}`,
            });
            const message = this.i18n.t('messages.sendEmailRecoveryPassword');
            return {
                message
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionRecoveryPassword = this.i18n.t('messages.messageActionRecoveryPassword');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionRecoveryPassword },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(resetDto, id) {
        try {
            const { password, confirmPassword } = resetDto;
            if (password !== confirmPassword) {
                const message = this.i18n.t('messages.errorPassword');
                throw new custom_error_1.default(message, common_1.HttpStatus.BAD_REQUEST);
            }
            const findUser = await this.prisma.user.findUnique({ where: { id } });
            if (!findUser) {
                const message = this.i18n.t('messages.userNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            await this.prisma.user.update({
                where: { id },
                data: {
                    password: await (0, encryption_1.hashPassword)(password),
                },
            });
            const message = this.i18n.t('messages.passwordUpdated');
            return { message };
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionResetPassword = this.i18n.t('messages.messageActionResetPassword');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionResetPassword },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        messanging_service_1.MessagingService,
        nestjs_i18n_1.I18nService])
], AuthService);
//# sourceMappingURL=auth.service.js.map