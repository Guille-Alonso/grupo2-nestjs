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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chart_service_1 = require("../chart/chart.service");
const aws_service_1 = require("../aws/aws.service");
const stream_1 = require("stream");
const nestjs_i18n_1 = require("nestjs-i18n");
const pagination_service_1 = require("../../utils/pagination/pagination.service");
let ReportsService = class ReportsService {
    constructor(prisma, chartService, awsService, i18n, paginationService) {
        this.prisma = prisma;
        this.chartService = chartService;
        this.awsService = awsService;
        this.i18n = i18n;
        this.paginationService = paginationService;
    }
    async create(createReportDto) {
        try {
            const report = await this.prisma.report.create({
                data: createReportDto,
            });
            const message = this.i18n.t('messages.reportCreated') + report;
            return message;
        }
        catch (error) {
            const message = this.i18n.t('messages.reportNotCreated') + error.message;
            throw new Error(message);
        }
    }
    async findAll(paginationDto2) {
        try {
            const { page, pageSize, sortBy, sortOrder } = paginationDto2;
            const { skip, take, orderBy } = this.paginationService.getPaginationParams(page, pageSize, sortBy, sortOrder);
            const [data, total] = await Promise.all([
                this.prisma.report.findMany({
                    where: {
                        isDeleted: false,
                    },
                    skip,
                    take,
                    orderBy,
                }),
                this.prisma.report.count(),
            ]);
            return this.paginationService.formatPaginatedResponse(data, total, page, pageSize);
        }
        catch (error) {
            const message = this.i18n.t('messages.productsNotFound') + error;
            throw new Error(message);
        }
    }
    async findOne(id) {
        try {
            const report = await this.prisma.report.findUnique({
                where: {
                    id,
                },
            });
            return report;
        }
        catch (error) {
            const message = this.i18n.t('messages.reportNotFound') + error;
            throw new Error(message);
        }
    }
    async update(id, updateReportDto) {
        return `This action${updateReportDto} updates a #${id} report`;
    }
    async remove(id) {
        try {
            const deleteReport = await this.prisma.report.update({
                where: {
                    id,
                },
                data: {
                    isDeleted: true,
                },
            });
            return { message: this.i18n.t('messages.reportDeleted'), deleteReport };
        }
        catch (error) {
            const message = this.i18n.t('messages.reportNotDeleted') + error;
            return new Error(message);
        }
    }
    async salesReport(id) {
        try {
            const sales = await this.prisma.cart.findMany({
                where: {
                    state: 'CONFIRMED',
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                    },
                },
            });
            if (sales.length === 0) {
                return new Error(this.i18n.t('messages.cartsNotFound'));
            }
            const salesByDate = await sales.reduce((acc, cart) => {
                const date = cart.createdAt.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += 1;
                return acc;
            }, {});
            const labels = Object.keys(salesByDate);
            const data = Object.values(salesByDate);
            const week = new Date(new Date().setDate(new Date().getDate() + 7));
            const chartData = {
                labels,
                datasets: [
                    {
                        label: 'Ventas del dia',
                        data,
                        backgroundColor: '#36A2EB',
                    },
                ],
            };
            const chartOptions = {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: `Ventas Totales de la semana ${new Date().toLocaleDateString()} - ${week.toLocaleDateString()}`,
                    },
                },
            };
            const report = await this.chartService.generateChart('bar', chartData, chartOptions);
            const file = {
                fieldname: 'file',
                originalname: `ventas-${new Date().toLocaleDateString()}.png`,
                encoding: '7bit',
                mimetype: 'image/png',
                buffer: report,
                size: report.length,
                stream: stream_1.Readable.from(report),
                destination: '',
                filename: '',
                path: '',
            };
            const { url, key } = await this.awsService.uploadFile(file, id);
            if (!url) {
                throw new Error(this.i18n.t('messages.fileNotUploaded'));
            }
            const reportdto = {
                content: url,
                type: 'VentaTotal',
                userId: id,
            };
            try {
                await this.prisma.report
                    .create({
                    data: reportdto,
                });
            }
            catch (error) {
                await this.awsService.deleteFile(key);
                const message = this.i18n.t('messages.reportNotCreated') + error.message;
                return message;
            }
            ;
            return url;
        }
        catch (e) {
            const message = this.i18n.t('messages.reportNotCreated') + e.message;
            return new Error(message);
        }
    }
    async productsReport(id) {
        try {
            const carts = await this.prisma.cart.findMany({
                where: {
                    state: 'CONFIRMED',
                },
                include: {
                    cartLine: { include: { product: true } },
                },
            });
            if (carts.length === 0) {
                return new Error(this.i18n.t('messages.cartsNotFound'));
            }
            const productsBySales = await carts.reduce((acc, cart) => {
                cart.cartLine.forEach(async (line) => {
                    if (!acc[line.product.name]) {
                        acc[line.product.name] = 0;
                    }
                    acc[line.product.name] += line.quantity;
                });
                return acc;
            }, {});
            const labels = Object.keys(productsBySales);
            const data = Object.values(productsBySales);
            const chartData = {
                labels,
                datasets: [
                    {
                        label: 'Cantidad de Productos Comprados',
                        data,
                        backgroundColor: '#36A2EB',
                    },
                ],
            };
            const chartOptions = {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Productos Comprados',
                    },
                },
            };
            const report = await this.chartService.generateChart('bar', chartData, chartOptions);
            const file = {
                fieldname: 'file',
                originalname: `productos-${new Date().toLocaleDateString()}.png`,
                encoding: '7bit',
                mimetype: 'image/png',
                buffer: report,
                size: report.length,
                stream: stream_1.Readable.from(report),
                destination: '',
                filename: '',
                path: '',
            };
            const { url, key } = await this.awsService.uploadFile(file, id);
            if (!url) {
                return new Error(this.i18n.t('messages.fileNotUploaded'));
            }
            const reportdto = {
                content: url,
                type: 'ProductosVendidos',
                userId: id,
            };
            try {
                await this.prisma.report
                    .create({
                    data: reportdto,
                });
            }
            catch (error) {
                await this.awsService.deleteFile(key);
                const message = this.i18n.t('messages.reportNotCreated') + error.message;
                return message;
            }
            ;
            return url;
        }
        catch (e) {
            const message = this.i18n.t('messages.reportNotCreated') + e.message;
            return new Error(message);
        }
    }
    async earningsReport(id) {
        try {
            const sales = await this.prisma.cart.findMany({
                where: {
                    state: 'CONFIRMED',
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                    },
                },
            });
            if (sales.length === 0) {
                return new Error(this.i18n.t('messages.cartsNotFound'));
            }
            const salesByDate = await sales.reduce((acc, cart) => {
                const date = cart.createdAt.toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += cart.totalAmount;
                return acc;
            }, {});
            const labels = Object.keys(salesByDate);
            const data = Object.values(salesByDate);
            const week = new Date(new Date().setDate(new Date().getDate() + 7));
            const chartData = {
                labels,
                datasets: [
                    {
                        label: 'Cantidad de ingresos por dia',
                        data,
                        backgroundColor: '#36A2EB',
                    },
                ],
            };
            const chartOptions = {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: `Ventas Totales de la semana ${new Date().toLocaleDateString()} - ${week.toLocaleDateString()}`,
                    },
                },
            };
            const report = await this.chartService.generateChart('bar', chartData, chartOptions);
            const file = {
                fieldname: 'file',
                originalname: `Ganancias semenales-${new Date().toLocaleDateString()}.png`,
                encoding: '7bit',
                mimetype: 'image/png',
                buffer: report,
                size: report.length,
                stream: stream_1.Readable.from(report),
                destination: '',
                filename: '',
                path: '',
            };
            const { url, key } = await this.awsService.uploadFile(file, id);
            if (!url) {
                return new Error(this.i18n.t('messages.fileNotUploaded'));
            }
            const reportdto = {
                content: url,
                type: 'GananciasSemanales',
                userId: id,
            };
            try {
                await this.prisma.report
                    .create({
                    data: reportdto,
                });
            }
            catch (error) {
                await this.awsService.deleteFile(key);
                const message = this.i18n.t('messages.reportNotCreated') + error.message;
                return message;
            }
            ;
            return url;
        }
        catch (e) {
            const message = this.i18n.t('messages.reportNotCreated') + e.message;
            return new Error(message);
        }
    }
    async earningsByProductReport(id) {
        try {
            const carts = await this.prisma.cart.findMany({
                where: {
                    state: 'CONFIRMED',
                },
                include: {
                    cartLine: { include: { product: true } },
                },
            });
            if (carts.length === 0) {
                return new Error(this.i18n.t('messages.salesNotFound'));
            }
            const productsBySales = await carts.reduce((acc, cart) => {
                cart.cartLine.forEach(async (line) => {
                    if (!acc[line.product.name]) {
                        acc[line.product.name] = 0;
                    }
                    acc[line.product.name] += line.total_price;
                });
                return acc;
            }, {});
            const labels = Object.keys(productsBySales);
            const data = Object.values(productsBySales);
            const chartData = {
                labels,
                datasets: [
                    {
                        label: 'Ganancias por producto',
                        data,
                        backgroundColor: '#36A2EB',
                    },
                ],
            };
            const chartOptions = {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Ganancias por producto',
                    },
                },
            };
            const report = await this.chartService.generateChart('bar', chartData, chartOptions);
            const file = {
                fieldname: 'file',
                originalname: `gananciasPorProducto-${new Date().toLocaleDateString()}.png`,
                encoding: '7bit',
                mimetype: 'image/png',
                buffer: report,
                size: report.length,
                stream: stream_1.Readable.from(report),
                destination: '',
                filename: '',
                path: '',
            };
            const { url, key } = await this.awsService.uploadFile(file, id);
            if (!url)
                throw new Error(this.i18n.t('messages.reportNotCreated'));
            console.log(url);
            const reportdto = {
                content: url,
                type: 'GananciasPorProducto',
                userId: id,
            };
            try {
                await this.prisma.report
                    .create({
                    data: reportdto,
                });
            }
            catch (error) {
                await this.awsService.deleteFile(key);
                const message = this.i18n.t('messages.reportNotCreated') + error.message;
                return message;
            }
            ;
            return url;
        }
        catch (e) {
            const message = this.i18n.t('messages.reportNotCreated') + e.message;
            return new Error(message);
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chart_service_1.ChartService,
        aws_service_1.AwsService,
        nestjs_i18n_1.I18nService,
        pagination_service_1.PaginationService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map