export declare class PrinterService {
    private printer;
    constructor();
    createPdf(documentDefinition: any): Promise<Buffer>;
}
