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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const create_report_dto_1 = require("./dto/create-report.dto");
const update_report_dto_1 = require("./dto/update-report.dto");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../utils/pagination/dto/pagination.dto");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    create(createReportDto) {
        return this.reportsService.create(createReportDto);
    }
    findAll(paginationDto2) {
        return this.reportsService.findAll(paginationDto2);
    }
    findOne(id) {
        return this.reportsService.findOne(id);
    }
    update(id, updateReportDto) {
        return this.reportsService.update(+id, updateReportDto);
    }
    remove(id) {
        return this.reportsService.remove(id);
    }
    async salesReport(id) {
        return await this.reportsService.salesReport(id);
    }
    async productsReport(id) {
        return await this.reportsService.productsReport(id);
    }
    async earningsReport(id) {
        return await this.reportsService.earningsReport(id);
    }
    async earningsByProductReport(id) {
        return await this.reportsService.earningsByProductReport(id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create report' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto2]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Sales report' }),
    (0, common_1.Get)('salesreport/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "salesReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Products report' }),
    (0, common_1.Get)('productsreport/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "productsReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Earnings report' }),
    (0, common_1.Get)('earningsreport/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "earningsReport", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Earnings by product report' }),
    (0, common_1.Get)('earningsbyproduct/report/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "earningsByProductReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map