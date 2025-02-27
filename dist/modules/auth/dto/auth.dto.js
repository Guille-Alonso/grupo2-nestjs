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
exports.ResetPasswordDto = exports.RecoverPasswordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class RecoverPasswordDto {
}
exports.RecoverPasswordDto = RecoverPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'joe@gmail.com',
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.IsEmail)({}, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isEmail'), }),
    __metadata("design:type", String)
], RecoverPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'Pass1234',
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.MinLength)(8, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.min', { constraint1: 8 }) }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'Pass1234',
    }),
    (0, class_validator_1.IsString)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString'),
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty'),
    }),
    (0, class_validator_1.MinLength)(8, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.min', { constraint1: 8 }) }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=auth.dto.js.map