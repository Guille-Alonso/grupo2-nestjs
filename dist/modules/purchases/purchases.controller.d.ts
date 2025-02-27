import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Response } from 'express';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: CreatePurchaseDto, req: any, res: Response): Promise<void>;
    findAll(req: any): Promise<any[]>;
}
