import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';
import { PrinterService } from '../printer/printer.service';
export declare class PurchasesService {
    private readonly prisma;
    private readonly i18n;
    private readonly printerService;
    constructor(prisma: PrismaService, i18n: I18nService, printerService: PrinterService);
    create(createPurchaseDto: CreatePurchaseDto, userId: any): Promise<Buffer>;
    findAll(userId: any): Promise<any[]>;
}
