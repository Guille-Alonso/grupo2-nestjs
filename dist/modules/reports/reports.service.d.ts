import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChartService } from '../chart/chart.service';
import { AwsService } from '../aws/aws.service';
import { CreateReportDto } from './dto/create-report.dto';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
export declare class ReportsService {
    private readonly prisma;
    private readonly chartService;
    private readonly awsService;
    private readonly i18n;
    private readonly paginationService;
    constructor(prisma: PrismaService, chartService: ChartService, awsService: AwsService, i18n: I18nService, paginationService: PaginationService);
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
    update(id: number, updateReportDto: UpdateReportDto): Promise<string>;
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
