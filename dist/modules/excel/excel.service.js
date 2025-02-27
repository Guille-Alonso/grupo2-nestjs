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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = __importStar(require("exceljs"));
const custom_error_1 = __importDefault(require("../../utils/custom.error"));
let ExcelService = class ExcelService {
    async generateExcel(data, columns, sheetName = 'Sheet1') {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(sheetName);
            worksheet.columns = columns;
            worksheet.getRow(1).font = { bold: true };
            data.forEach((item) => {
                worksheet.addRow(item);
            });
            worksheet.columns.forEach((column) => {
                const maxLength = (column.values || []).reduce((max, value) => {
                    if (value && value.toString().length > max) {
                        return value.toString().length;
                    }
                    return max;
                }, 0);
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });
            return workbook;
        }
        catch (error) {
            throw new custom_error_1.default(error?.message || "server error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportToResponse(res, workbook, filename) {
        try {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            await workbook.xlsx.write(res);
            res.end();
        }
        catch (error) {
            throw new custom_error_1.default(error?.message || "server error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async readExcel(buffer) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const worksheet = workbook.worksheets[0];
            const headers = [];
            worksheet.getRow(1).eachCell((cell) => {
                headers.push(cell.value?.toString() || '');
            });
            const data = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1)
                    return;
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber - 1];
                    if (header) {
                        rowData[header] =
                            cell.value.toString().trim() === '' ? null : cell.value;
                    }
                });
                data.push(rowData);
            });
            return data;
        }
        catch (error) {
            throw new custom_error_1.default(error?.message || "server error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)()
], ExcelService);
//# sourceMappingURL=excel.service.js.map