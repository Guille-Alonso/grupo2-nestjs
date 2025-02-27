"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AwsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const constants_1 = require("../../common/constants");
let AwsService = AwsService_1 = class AwsService {
    constructor() {
        this.logger = new common_1.Logger(AwsService_1.name);
        this.s3Client = new client_s3_1.S3Client(constants_1.awsConfig.client);
    }
    async uploadFile(file, userId) {
        const fileExtensionsByMimetype = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/tiff': 'tiff',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'application/zip': 'zip',
            'application/x-rar-compressed': 'rar',
            'text/plain': 'txt',
            'text/csv': 'csv',
            'application/json': 'json',
        };
        let key = '';
        try {
            const { mimetype } = file;
            const extension = fileExtensionsByMimetype[mimetype] ?? 'file';
            key = `user_${userId}/${crypto.randomUUID()}.${extension}`;
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: constants_1.awsConfig.s3.bucket,
                ContentType: mimetype,
                Key: key,
                Body: file.buffer,
            }));
            return {
                url: `https://${constants_1.awsConfig.s3.bucket}.s3.${constants_1.awsConfig.client.region}.amazonaws.com/${key}`,
                key,
            };
        }
        catch (err) {
            this.logger.error(`Error uploading file`, err);
            if (key) {
                await this.deleteFile(key);
            }
            throw new Error('Error al subir el archivo a S3');
        }
    }
    async deleteFile(fileKey) {
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: constants_1.awsConfig.s3.bucket,
                Key: fileKey,
            }));
            this.logger.log(`Archivo eliminado: ${fileKey}`);
        }
        catch (err) {
            this.logger.error(`Error al eliminar el archivo: ${fileKey}`, err.stack);
        }
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = AwsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsService);
//# sourceMappingURL=aws.service.js.map