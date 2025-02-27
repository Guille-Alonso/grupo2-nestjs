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
exports.FilterProductsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../utils/pagination/dto/pagination.dto");
const nestjs_i18n_1 = require("nestjs-i18n");
const class_transformer_1 = require("class-transformer");
class FilterProductsDto extends (0, swagger_1.PartialType)(pagination_dto_1.PaginationDto2) {
}
exports.FilterProductsDto = FilterProductsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Product 1',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", String)
], FilterProductsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product SKU', example: '1234', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", String)
], FilterProductsDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product min price',
        example: '100',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNumber') }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product max price',
        example: '100',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNumber') }),
    (0, class_validator_1.Min)(0, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.min') }),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product category',
        example: 'Electronics',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", String)
], FilterProductsDto.prototype, "category", void 0);
//# sourceMappingURL=filter-product.dto.js.map