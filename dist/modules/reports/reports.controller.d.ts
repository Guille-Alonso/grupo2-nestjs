import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(createReportDto: CreateReportDto): Promise<string>;
    findAll(paginationDto2: PaginationDto2): Promise<{
        data: {
            type: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            content: string;
            userId: string;
        }[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        type: string;
        createdAt: Date;
        id: string;
        updatedAt: Date;
        isDeleted: boolean;
        content: string;
        userId: string;
    }>;
    update(id: string, updateReportDto: UpdateReportDto): Promise<string>;
    remove(id: string): Promise<Error | {
        message: string;
        deleteReport: {
            type: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            content: string;
            userId: string;
        };
    }>;
    salesReport(id: string): Promise<string | Error>;
    productsReport(id: string): Promise<string | Error>;
    earningsReport(id: string): Promise<string | Error>;
    earningsByProductReport(id: string): Promise<string | Error>;
}
