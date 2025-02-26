import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';

@Injectable()
export class PrinterService {
    private printer: PdfPrinter;

    constructor() {
        const fonts = {
            Arial: {
                normal: 'src/assets/fonts/arial.ttf',
                bold: 'src/assets/fonts/arial_narrow.ttf',
                italics: 'src/assets/fonts/arial_italic.ttf',
                bolditalics: 'src/assets/fonts/arial_narrow.ttf',
                600: 'src/assets/fonts/arial_narrow.ttf',
            },
            Roboto: {
                normal: 'src/assets/fonts/Roboto-Regular.ttf',
                bold: 'src/assets/fonts/Roboto-Bold.ttf',
                italics: 'src/assets/fonts/Roboto-italic.ttf',
                bolditalics: 'src/assets/fonts/Roboto-Boldtalic.ttf',
                600: 'src/assets/fonts/Roboto-Black.ttf'
            }
        };
        this.printer = new PdfPrinter(fonts);
    }

    async createPdf(documentDefinition: any): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            try {
                const pdfDoc = this.printer.createPdfKitDocument(documentDefinition);
                const chunks: Buffer[] = [];

                pdfDoc.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                pdfDoc.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                pdfDoc.on('error', reject);

                pdfDoc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}