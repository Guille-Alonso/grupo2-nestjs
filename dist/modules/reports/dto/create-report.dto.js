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
exports.CreateReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report url content',
        example: 'https://google.com',
    }),
    (0, class_validator_1.IsUrl)({}, { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isUrl') }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    __metadata("design:type", String)
], CreateReportDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report type', example: 'url' }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isString') }),
    __metadata("design:type", String)
], CreateReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User id',
        example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isNotEmpty') }),
    (0, class_validator_1.IsUUID)('4', { message: (0, nestjs_i18n_1.i18nValidationMessage)('errors.isUUID') }),
    __metadata("design:type", String)
], CreateReportDto.prototype, "userId", void 0);
//# sourceMappingURL=create-report.dto.js.map