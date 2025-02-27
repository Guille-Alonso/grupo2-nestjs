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
exports.CreatePurchaseDto = exports.ProductPurchase = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
const create_product_dto_1 = require("../../products/dto/create-product.dto");
class ProductPurchase {
}
exports.ProductPurchase = ProductPurchase;
__decorate([
    (0, swagger_1.ApiProperty)({ type: create_product_dto_1.CreateProductDto, description: 'product detail' }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_product_dto_1.CreateProductDto),
    __metadata("design:type", create_product_dto_1.CreateProductDto)
], ProductPurchase.prototype, "product", void 0);
class CreatePurchaseDto {
}
exports.CreatePurchaseDto = CreatePurchaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos añadidos al carrito',
        type: 'array',
        items: { type: 'object', $ref: '#/components/schemas/ProductPurchase' },
        example: [
            { product: { name: "pepsi", description: "330ml", price: 12.11, stock: 2, barcode: "5449000000996", sku: "00000001" } },
            { product: { name: "coca", description: "330ml", price: 13.11, stock: 12, barcode: "5449021000996", sku: "00000002" } },
        ],
    }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(15),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductPurchase),
    __metadata("design:type", Array)
], CreatePurchaseDto.prototype, "productPurchase", void 0);
//# sourceMappingURL=create-purchase.dto.js.map