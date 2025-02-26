import { Injectable } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
// import { ChartService } from '../chart/chart.service';
import { AwsService } from '../aws/aws.service';
import { ChartConfiguration } from 'chart.js';
import { CreateReportDto } from './dto/create-report.dto';
import { Readable } from 'stream';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly chartService: ChartService,
    private readonly awsService: AwsService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService
  ) {}
  async create(createReportDto: CreateReportDto) {
    try {
      const report = await this.prisma.report.create({
        data: createReportDto,
      })
      const message = this.i18n.t('messages.reportCreated')+report;
      return message
    } catch (error) {
      const message = this.i18n.t('messages.reportNotCreated')+error.message;
      throw new Error(message);
    }
  }

  async findAll( paginationDto2: PaginationDto2) {
    try {
      const { page, pageSize, sortBy, sortOrder } = paginationDto2;
      const { skip, take, orderBy } =
        this.paginationService.getPaginationParams(
          page,
          pageSize,
          sortBy,
          sortOrder,
        );

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

      return this.paginationService.formatPaginatedResponse(
        data,
        total,
        page,
        pageSize,
      );
    } catch (error) {
      const message = this.i18n.t('messages.productsNotFound') + error;
      throw new Error(message);
    }
  }

  async findOne(id: string) {
    try {
      const report = await this.prisma.report.findUnique({
        where: {
          id,
        },
      });
      return report;    
    } catch (error) {
      const message = this.i18n.t('messages.reportNotFound') + error;
      throw new Error(message);
    }
  }
//eliminar
  async update(id: number, updateReportDto: UpdateReportDto) {
    return `This action${updateReportDto} updates a #${id} report`;
  }

  async remove(id: string) {
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
    } catch (error) {
      const message = this.i18n.t('messages.reportNotDeleted') + error;
      throw new Error(message);
    }
  }

  // async salesReport(id: string): Promise<Buffer> {
  //   try {
  //     const sales = await this.prisma.cart.findMany({
  //       where: {
  //         state: 'CONFIRMED',
  //         createdAt: {
  //           gte: new Date(new Date().setDate(new Date().getDate() - 7)),
  //         },
  //       },
  //     });
  //     const salesByDate = await sales.reduce((acc, cart) => {
  //       const date = cart.createdAt.toISOString().split('T')[0];
  //       if (!acc[date]) {
  //         acc[date] = 0;
  //       }
  //       acc[date] += 1;
  //       return acc;
  //     }, {});

  //     const labels = Object.keys(salesByDate);
  //     const data = Object.values(salesByDate);

  //     const chartData = {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Ventas Totales de la semana',
  //           data,
  //           backgroundColor: '#36A2EB',
  //         },
  //       ],
  //     };
  //     const chartOptions: ChartConfiguration['options'] = {
  //       responsive: true,
  //       plugins: {
  //         legend: { position: 'top' as const },
  //         title: {
  //           display: true,
  //           text: 'Ventas de la semana',
  //         },
  //       },
  //     };

  //     const report = await this.chartService.generateChart(
  //       'bar',
  //       chartData,
  //       chartOptions,
  //     );
  //     const file: Express.Multer.File = {
  //       fieldname: 'file',
  //       originalname: 'report.png',
  //       encoding: '7bit',
  //       mimetype: 'image/png',
  //       buffer: report,
  //       size: report.length,
  //       stream: Readable.from(report),
  //       destination: '',
  //       filename: '',
  //       path: '',
  //     };

  //     const { url, key } = await this.awsService.uploadFile(file, id);

  //     const reportdto: CreateReportDto = {
  //       content: url,
  //       type: 'VentaTotal',
  //       userId: id,
  //     };
  //     try {
  //       await this.prisma.report.create({
  //         data: reportdto,
  //       });
  //     } catch {
  //       await this.awsService.deleteFile(key);
  //     }
  //     return report;
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // }


  // async productsReport(id: string): Promise<Buffer> {
  //   try {
  //     const carts = await this.prisma.cart.findMany({
  //       where: {
  //         state: 'CONFIRMED',
  //       },
  //       include: {
  //         cartLine: { include: { product: true } },
  //       },
  //     });
  //     const productsBySales = await carts.reduce((acc, cart) => {
  //       cart.cartLine.forEach(async (line) => {
  //         if (!acc[line.product.name]) {
  //           acc[line.product.name] = 0;
  //         }
  //         acc[line.product.name] += line.quantity;
  //       });
  //       return acc;
  //     }, {});
  //     const labels = Object.keys(productsBySales);
  //     const data = Object.values(productsBySales);

  //     const chartData = {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Cantidad de Productos Comprados',
  //           data,
  //           backgroundColor: '#36A2EB',
  //         },
  //       ],
  //     };

  //     const chartOptions: ChartConfiguration['options'] = {
  //       responsive: true,
  //       plugins: {
  //         legend: { position: 'top' as const },
  //         title: {
  //           display: true,
  //           text: 'Productos Comprados',
  //         },
  //       },
  //     };

  //     const report = await this.chartService.generateChart(
  //       'bar',
  //       chartData,
  //       chartOptions,
  //     );
  //     const file: Express.Multer.File = {
  //       fieldname: 'file',
  //       originalname: 'report.png',
  //       encoding: '7bit',
  //       mimetype: 'image/png',
  //       buffer: report,
  //       size: report.length,
  //       stream: Readable.from(report),
  //       destination: '',
  //       filename: '',
  //       path: '',
  //     };

  //     const { url, key } = await this.awsService.uploadFile(file, id);

  //     const reportdto: CreateReportDto = {
  //       content: url,
  //       type: 'VentaTotal',
  //       userId: id,
  //     };
  //     try {
  //       await this.prisma.report.create({
  //         data: reportdto,
  //       });
  //     } catch {
  //       await this.awsService.deleteFile(key);
  //     }

  //     return report;
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // }

  // async earningsReport(id: string): Promise<Buffer> {
  //   try {
  //     const sales = await this.prisma.cart.findMany({
  //       where: {
  //         state: 'CONFIRMED',
  //         createdAt: {
  //           gte: new Date(new Date().setDate(new Date().getDate() - 7)),
  //         },
  //       },
  //     });
  //     const salesByDate = await sales.reduce((acc, cart) => {
  //       const date = cart.createdAt.toISOString().split('T')[0];
  //       if (!acc[date]) {
  //         acc[date] = 0;
  //       }
  //       acc[date] += cart.totalAmount;
  //       return acc;
  //     }, {});
  //     const labels = Object.keys(salesByDate);
  //     const data = Object.values(salesByDate);

  //     const chartData = {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Ingresos de la semana',
  //           data,
  //           backgroundColor: '#36A2EB',
  //         },
  //       ],
  //     };
  //     const chartOptions: ChartConfiguration['options'] = {
  //       responsive: true,
  //       plugins: {
  //         legend: { position: 'top' as const },
  //         title: {
  //           display: true,
  //           text: 'Ingresos de la semana',
  //         },
  //       },
  //     };

  //     const report = await this.chartService.generateChart(
  //       'bar',
  //       chartData,
  //       chartOptions,
  //     );
  //     const file: Express.Multer.File = {
  //       fieldname: 'file',
  //       originalname: 'report.png',
  //       encoding: '7bit',
  //       mimetype: 'image/png',
  //       buffer: report,
  //       size: report.length,
  //       stream: Readable.from(report),
  //       destination: '',
  //       filename: '',
  //       path: '',
  //     };

  //     const { url, key } = await this.awsService.uploadFile(file, id);

  //     const reportdto: CreateReportDto = {
  //       content: url,
  //       type: 'VentaTotal',
  //       userId: id,
  //     };
  //     try {
  //       await this.prisma.report.create({
  //         data: reportdto,
  //       });
  //     } catch {
  //       await this.awsService.deleteFile(key);
  //     }
  //     return report;
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // }

  // async earningsByProductReport(id: string): Promise<Buffer> {
  //   try {
  //     const carts = await this.prisma.cart.findMany({
  //       where: {
  //         state: 'CONFIRMED',
  //       },
  //       include: {
  //         cartLine: { include: { product: true } },
  //       },
  //     });
  //     const productsBySales = await carts.reduce((acc, cart) => {
  //       cart.cartLine.forEach(async (line) => {
  //         if (!acc[line.product.name]) {
  //           acc[line.product.name] = 0;
  //         }
  //         acc[line.product.name] += line.total_price;
  //       });
  //       return acc;
  //     }, {});
  //     const labels = Object.keys(productsBySales);
  //     const data = Object.values(productsBySales);

  //     const chartData = {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Ganancias por producto',
  //           data,
  //           backgroundColor: '#36A2EB',
  //         },
  //       ],
  //     };
  //     const chartOptions: ChartConfiguration['options'] = {
  //       responsive: true,
  //       plugins: {
  //         legend: { position: 'top' as const },
  //         title: {
  //           display: true,
  //           text: 'Ganancias por producto',
  //         },
  //       },
  //     };

  //     const report = await this.chartService.generateChart(
  //       'bar',
  //       chartData,
  //       chartOptions,
  //     );

  //     const file: Express.Multer.File = {
  //       fieldname: 'file',
  //       originalname: 'report.png',
  //       encoding: '7bit',
  //       mimetype: 'image/png',
  //       buffer: report,
  //       size: report.length,
  //       stream: Readable.from(report),
  //       destination: '',
  //       filename: '',
  //       path: '',
  //     };

  //     const { url, key } = await this.awsService.uploadFile(file, id);

  //     const reportdto: CreateReportDto = {
  //       content: url,
  //       type: 'VentaTotal',
  //       userId: id,
  //     };
  //     try {
  //       await this.prisma.report.create({
  //         data: reportdto,
  //       });
  //     } catch {
  //       await this.awsService.deleteFile(key);
  //     }
  //     return report;
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // }
}
