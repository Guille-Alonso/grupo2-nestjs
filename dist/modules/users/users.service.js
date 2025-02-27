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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const prisma_service_1 = require("../prisma/prisma.service");
const aws_service_1 = require("../aws/aws.service");
const excel_service_1 = require("../excel/excel.service");
const pagination_utils_1 = require("../../utils/pagination/pagination.utils");
const nestjs_i18n_1 = require("nestjs-i18n");
const parsing_1 = require("../../utils/parsing");
const encryption_1 = require("../../utils/encryption");
const messanging_service_1 = require("../messanging/messanging.service");
const constants_1 = require("../../common/constants");
const custom_error_1 = __importDefault(require("../../utils/custom.error"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let UsersService = class UsersService {
    constructor(prisma, awsService, excelService, i18n, messagingService) {
        this.prisma = prisma;
        this.awsService = awsService;
        this.excelService = excelService;
        this.i18n = i18n;
        this.messagingService = messagingService;
    }
    async create(user) {
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
    async findAll() {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    isDeleted: false,
                },
            });
            if (!Array.isArray(users) || users.length === 0) {
                const message = this.i18n.t('messages.usersNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            return users;
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionFindUser },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAllUserWithPagination(pagination) {
        try {
            const { search } = pagination;
            const where = {
                isDeleted: false,
                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            };
            const baseQuery = {
                where,
                ...(0, pagination_utils_1.getPaginationFilter)(pagination),
            };
            const total = await this.prisma.user.count({ where });
            if (total === 0) {
                const message = this.i18n.t('messages.usersNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            const dataUsers = await this.prisma.user.findMany(baseQuery);
            if (!Array.isArray(dataUsers) || dataUsers.length === 0) {
                const message = this.i18n.t('messages.usersNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            const res = (0, parsing_1.Paginate)(dataUsers, total, pagination);
            return res;
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionFindUser },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                const message = this.i18n.t('messages.userNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionFindUser },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateUserDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!existingUser) {
                const message = this.i18n.t('messages.userNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            if (updateUserDto.email) {
                const userExists = await this.prisma.user.findFirst({
                    where: {
                        email: {
                            equals: updateUserDto.email,
                            mode: 'insensitive',
                        },
                    },
                });
                if (userExists && userExists.id !== id) {
                    const message = this.i18n.t('messages.existingEmail');
                    throw new custom_error_1.default(message, common_1.HttpStatus.CONFLICT);
                }
                const updatedUser = await this.prisma.user.update({
                    where: { id },
                    data: {
                        ...updateUserDto,
                        email: { set: updateUserDto.email.toLowerCase() },
                    },
                });
                const message = this.i18n.t('messages.userSuccessfullyUpdated');
                return {
                    message,
                    user: updatedUser,
                };
            }
            else {
                const updatedUser = await this.prisma.user.update({
                    where: { id },
                    data: updateUserDto,
                });
                const message = this.i18n.t('messages.userSuccessfullyUpdated');
                return {
                    message,
                    user: updatedUser,
                };
            }
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionUpdateUser = this.i18n.t('messages.messageActionUpdateUser');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionUpdateUser },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!existingUser) {
                const message = this.i18n.t('messages.userNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            const deletedUser = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    isDeleted: true,
                },
            });
            const message = this.i18n.t('messages.userSuccessfullyDeleted');
            return {
                message,
                user: deletedUser,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionDeleteUser = this.i18n.t('messages.messageActionDeleteUser');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionDeleteUser },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    extractFileKeyFromUrl(url) {
        const baseUrl = `https://${constants_1.awsConfig.s3.bucket}.s3.${constants_1.awsConfig.client.region}.amazonaws.com/`;
        return url.replace(baseUrl, '');
    }
    async updateUserProfile(id, createProfileDto, file) {
        let uploadResult = null;
        try {
            if (file && !file.mimetype.startsWith('image/')) {
                const message = this.i18n.t('messages.typeFileProfile');
                throw new custom_error_1.default(message, common_1.HttpStatus.BAD_REQUEST);
            }
            let existingProfile = await this.prisma.profile.findUnique({
                where: { userId: id },
            });
            if (file) {
                if (existingProfile?.photo) {
                    const oldPhotoKey = this.extractFileKeyFromUrl(existingProfile.photo);
                    await this.awsService.deleteFile(oldPhotoKey);
                }
                uploadResult = await this.awsService.uploadFile(file, id);
            }
            const profileData = {
                address: createProfileDto.address,
                phone: createProfileDto.phone,
                ...(uploadResult ? { photo: uploadResult.url } : {}),
            };
            if (!existingProfile) {
                existingProfile = await this.prisma.profile.create({
                    data: {
                        address: profileData.address,
                        phone: profileData.phone,
                        photo: profileData.photo,
                        userId: id
                    },
                });
            }
            else {
                existingProfile = await this.prisma.profile.update({
                    where: { userId: id },
                    data: profileData,
                });
            }
            return { message: 'ok', profile: existingProfile };
        }
        catch (error) {
            if (uploadResult) {
                await this.awsService.deleteFile(file.filename);
            }
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageActionProfile = this.i18n.t('messages.messageActionProfile');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageActionProfile },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportAllExcel(res) {
        try {
            const users = await this.findAll();
            if (!Array.isArray(users) || users.length === 0) {
                const message = this.i18n.t('messages.usersNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.NOT_FOUND);
            }
            const columns = [
                { header: 'Nombre', key: 'name' },
                { header: 'Apellido', key: 'lastName' },
                { header: 'Email', key: 'email' },
                { header: 'Rol de Usuario', key: 'role' },
            ];
            const workbook = await this.excelService.generateExcel(users, columns, 'Usuarios');
            await this.excelService.exportToResponse(res, workbook, 'usuarios.xlsx');
        }
        catch (error) {
            if (error instanceof custom_error_1.default) {
                throw error;
            }
            const messageExportExcel = this.i18n.t('messages.messageExportExcel');
            const message = this.i18n.t('messages.genericError', {
                args: { action: messageExportExcel },
            });
            throw new custom_error_1.default(error?.message || message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadUsers(buffer) {
        try {
            if (!buffer) {
                throw new custom_error_1.default(this.i18n.t('messages.fileNotProvided'), common_1.HttpStatus.BAD_REQUEST);
            }
            const users = await this.excelService.readExcel(buffer);
            if (!users || users.length === 0) {
                throw new custom_error_1.default(this.i18n.t('messages.emptyFile'), common_1.HttpStatus.BAD_REQUEST);
            }
            let createdCount = 0;
            let duplicatedCount = 0;
            let validationErrorsCount = 0;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                const userDto = (0, class_transformer_1.plainToInstance)(create_user_dto_1.CreateUserDto, element);
                const errors = await (0, class_validator_1.validate)(userDto);
                if (errors.length > 0) {
                    validationErrorsCount++;
                    continue;
                }
                if (element.email) {
                    const userExists = await this.prisma.user.findFirst({
                        where: {
                            email: {
                                equals: element.email,
                                mode: 'insensitive',
                            },
                        },
                    });
                    if (!userExists) {
                        await this.create(element);
                        createdCount++;
                    }
                    else {
                        duplicatedCount++;
                    }
                }
            }
            return {
                created: createdCount,
                duplicated: duplicatedCount,
                validationErrors: validationErrorsCount,
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        aws_service_1.AwsService,
        excel_service_1.ExcelService,
        nestjs_i18n_1.I18nService,
        messanging_service_1.MessagingService])
], UsersService);
//# sourceMappingURL=users.service.js.map