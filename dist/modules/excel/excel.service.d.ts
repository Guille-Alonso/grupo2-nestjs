import * as ExcelJS from 'exceljs';
import { ExcelColumn } from 'src/common/interfaces';
export declare class ExcelService {
    generateExcel(data: any[], columns: ExcelColumn[], sheetName?: string): Promise<ExcelJS.Workbook>;
    exportToResponse(res: any, workbook: ExcelJS.Workbook, filename: string): Promise<void>;
    readExcel(buffer: Buffer): Promise<any[]>;
}
