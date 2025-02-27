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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_service_1 = require("../../utils/pagination/pagination.service");
const custom_error_1 = __importDefault(require("../../utils/custom.error"));
const nestjs_i18n_1 = require("nestjs-i18n");
const aws_service_1 = require("../aws/aws.service");
let ImagesService = class ImagesService {
    constructor(prisma, paginationService, i18n, awsService) {
        this.prisma = prisma;
        this.paginationService = paginationService;
        this.i18n = i18n;
        this.awsService = awsService;
    }
    async create(createImageDto) {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id: createImageDto.productId, isDeleted: false },
                select: { id: true },
            });
            if (product.id == null) {
                const message = this.i18n.t('messages.productNotFound');
                throw new custom_error_1.default(message, common_1.HttpStatus.BAD_REQUEST);
            }
            const image = await this.prisma.image.create({
                data: createImageDto,
            });
            const message = this.i18n.t('messages.imageCreated') + image;
            return message;
        }
        catch (error) {
            const message = this.i18n.t('messages.imageNotCreated') + error.message;
            throw new Error(message);
        }
    }
    async findAll(paginationDto) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.image.findMany({
                    where: {
                        isDeleted: false,
                    },
                    skip,
                    take,
                    orderBy,
                }),
                this.prisma.image.count(),
            ]);
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (error) {
            const message = this.i18n.t('messages.imagesNotFound');
            throw new Error(message + error.message);
        }
    }
    async findOne(id) {
        try {
            const image = await this.prisma.product.findUnique({
                where: {
                    id,
                },
            });
            return image;
        }
        catch (error) {
            const message = this.i18n.t('messages.imageNotFound');
            throw new Error(message + error.message);
        }
    }
    async update(id, updateImageDto) {
        try {
            const image = await this.prisma.image.update({
                where: {
                    id,
                },
                data: updateImageDto,
            });
            const message = this.i18n.t('messages.imageUpdated') + image;
            return message;
        }
        catch (error) {
            const message = this.i18n.t('messages.imageNotUpdated');
            throw new Error(message + error.message);
        }
    }
    async remove(id) {
        try {
            const deleteImage = await this.prisma.product.update({
                where: {
                    id,
                },
                data: {
                    isDeleted: true,
                },
            });
            const message = this.i18n.t('messages.imageDeleted');
            return { message, deleteImage };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async assignImage(files, productId) {
        try {
            console.log(files);
            console.log(productId);
            for (const file of files) {
                const { url, key } = await this.awsService.uploadFile(file, productId);
                this.prisma.image
                    .update({
                    where: {
                        productId,
                    },
                    data: {
                        colection: {
                            push: url,
                        },
                    },
                })
                    .catch(async () => {
                    await this.awsService.deleteFile(key);
                    console.log('error');
                });
                const message = this.i18n.t('messages.imageAssigned');
                return message;
            }
        }
        catch (error) {
            const message = this.i18n.t('messages.imageNotAssigned') + error.message;
            throw new Error(message);
        }
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_service_1.PaginationService,
        nestjs_i18n_1.I18nService,
        aws_service_1.AwsService])
], ImagesService);
//# sourceMappingURL=images.service.js.map