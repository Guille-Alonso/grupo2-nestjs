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
exports.UpdateProfileDto = exports.CreateProfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class CreateProfileDto {
}
exports.CreateProfileDto = CreateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Address',
        example: '47 street',
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.Length)(5, 60, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.length', { constraint1: 5, constraint2: 60 }),
    }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User Phone',
        example: '3816587452',
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.Length)(5, 15, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.length', { constraint1: 5, constraint2: 15 }),
    }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "phone", void 0);
class UpdateProfileDto extends (0, mapped_types_1.PartialType)(CreateProfileDto) {
}
exports.UpdateProfileDto = UpdateProfileDto;
//# sourceMappingURL=create-profile.dto.js.map