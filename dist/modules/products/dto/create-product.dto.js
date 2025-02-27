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
exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the product', example: 'Product 1' }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the product',
        example: 'Product 1',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the product', example: 100 }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsNumber)({}, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNumber'),
    }),
    (0, class_validator_1.IsPositive)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isPositive'),
    }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock of the product', example: 10 }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsPositive)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isPositive'),
    }),
    (0, class_validator_1.IsInt)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isInt'),
    }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Barcode of the product',
        example: '1234567890123',
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.Matches)(/^[0-9]+$/, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.numberCode'),
    }),
    (0, class_validator_1.Length)(13, 13, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.length', {
            constraint1: 13,
            constraint2: 13,
        }),
    }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sku of the product', example: '1234567890' }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.MaxLength)(50, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('oerrors.maxLength', { constraint1: 50 }),
    }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Images of the product',
        example: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.png',
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isArrayString') }),
    (0, class_validator_1.IsString)({ each: true, message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ids of the product',
        example: [
            '12c93ed5-39e7-4ca2-bc5c-55b1f92dd622',
            '710813cb-65c8-49c6-9b6c-f34f151257f3',
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isArrayUUID') }),
    (0, class_validator_1.IsUUID)('4', {
        each: true,
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isArrayUUID'),
    }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "categoryIds", void 0);
//# sourceMappingURL=create-product.dto.js.map