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
exports.CreateCartDto = exports.CreaterCartLineDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class CreaterCartLineDTO {
}
exports.CreaterCartLineDTO = CreaterCartLineDTO;
__decorate([
    (0, class_validator_1.IsPositive)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isPositive'),
    }),
    (0, class_validator_1.IsNumber)({}, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNumber'),
    }),
    __metadata("design:type", Number)
], CreaterCartLineDTO.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    __metadata("design:type", String)
], CreaterCartLineDTO.prototype, "productId", void 0);
class CreateCartDto {
}
exports.CreateCartDto = CreateCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'id of User', example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1' }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    __metadata("design:type", String)
], CreateCartDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos añadidos al carrito',
        type: 'array',
        items: { type: 'object', $ref: '#/components/schemas/CreateCartLineDTO' },
        example: [
            { quantity: 2, productId: 'b5e0318f-0105-4ae1-bf67-9edec9a9b4f1' },
            { quantity: 1, productId: 'b5e0311f-1105-1Be1-bQ17-2Adec9a9b4f1' },
        ],
    }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsArray)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    (0, class_validator_1.ArrayMinSize)(1, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.arrayMin', { x: 1 }) }),
    (0, class_validator_1.ArrayMaxSize)(15, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.arrayMax', { x: 15 }) }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreaterCartLineDTO),
    __metadata("design:type", Array)
], CreateCartDto.prototype, "cartLine", void 0);
//# sourceMappingURL=create-cart.dto.js.map