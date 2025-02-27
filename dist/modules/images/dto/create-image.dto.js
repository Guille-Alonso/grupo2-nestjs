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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class CreateImageDto {
}
exports.CreateImageDto = CreateImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image name', example: ['https://example.com/image1.jpg', 'https://example.com/image2.png'] }),
    (0, class_validator_1.IsArray)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isArray') }),
    (0, class_validator_1.IsUrl)({}, { each: true, message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isUrl') }),
    (0, class_validator_1.Matches)(/\.(jpg|png)$/i, { each: true, message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isImage') }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateImageDto.prototype, "colection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product id', example: 'hkasf-asohfioasf' }),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    __metadata("design:type", String)
], CreateImageDto.prototype, "productId", void 0);
//# sourceMappingURL=create-image.dto.js.map