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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrinterService = void 0;
const common_1 = require("@nestjs/common");
const pdfmake_1 = __importDefault(require("pdfmake"));
let PrinterService = class PrinterService {
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
        this.printer = new pdfmake_1.default(fonts);
    }
    async createPdf(documentDefinition) {
        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = this.printer.createPdfKitDocument(documentDefinition);
                const chunks = [];
                pdfDoc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                pdfDoc.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                pdfDoc.on('error', reject);
                pdfDoc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.PrinterService = PrinterService;
exports.PrinterService = PrinterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrinterService);
//# sourceMappingURL=printer.service.js.map