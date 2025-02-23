import { Injectable } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChartService } from '../chart/chart.service';
import { AwsService } from '../aws/aws.service';

import { ChartConfiguration } from 'chart.js';
import { CreateReportDto } from './dto/create-report.dto';

import { Readable } from 'stream';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chartService: ChartService,
    private readonly awsService: AwsService,
    //private readonly jwtService: JwtService,
    //private readonly printerService: PrinterService,
    //private readonly i18n: I18nService
  ) {}
  create(createReportDto: CreateReportDto) {
    this.prisma.report.create({
      data: createReportDto
    })
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action${updateReportDto} updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  async salesReport( userId: string) {
    try {
      const sales = await this.prisma.cart.findMany({
        where: {
          state: 'CONFIRMED',
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      });
      console.log(sales);
      const salesByDate = await sales.reduce((acc, cart) => {
        const date = cart.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
      },{});

      console.log(salesByDate);
      const labels = Object.keys(salesByDate);
      const data = Object.values(salesByDate);

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Ventas Totales de la semana',
            data,
            backgroundColor: '#36A2EB',
          },
        ],
      };
      const chartOptions:ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: {
            display: true,
            text: 'Ventas de la semana',
          },
        },
      };

      const report = await this.chartService.generateChart(
        'bar',
        chartData,
        chartOptions,
      );
      return report;
      /*console.log(report);
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'report.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: report, // Aquí asignamos el buffer generado
        size: report.length,
        stream: Readable.from(report),
        destination: '',
        filename: '',
        path: '',
      };
      console.log(file);
      const reportdto:CreateReportDto= {
        content: url,
        type: 'VentaTotal',
        userId
      }
      this.create(reportdto);
      
      return { Message: 'reporte generado',
        report,
        url
       };*/
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async productsReport(): Promise<Buffer> {
    try{
      const carts = await this.prisma.cart.findMany({
        where: {
          state: 'CONFIRMED',
        },
        include: {
          cartLine:{ include: { product: true } },
        }
      })
      console.log(carts);
      const productsBySales = await carts.reduce((acc, cart) => {
          cart.cartLine.forEach(async line => {
            if (!acc[line.product.name]) {
              acc[line.product.name] = 0;
            }
            acc[line.product.name] += line.quantity;
          });
          return acc;
      },{});
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

    const chartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: {
          display: true,
          text: 'Productos Comprados',
        },
      },
    };

    const report = await this.chartService.generateChart(
      'bar',
      chartData,
      chartOptions,
    );

    return report;
    }catch(e){
      throw new Error(e.message);
    }
  }

  async earningsReport(): Promise<Buffer> {
    try{
      const sales = await this.prisma.cart.findMany({
        where: {
          state: 'CONFIRMED',
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      });
      const salesByDate = await sales.reduce((acc, cart) => {
        const date = cart.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += cart.totalAmount;
        return acc;
      },{});
      const labels = Object.keys(salesByDate);
      const data = Object.values(salesByDate);

      const chartData = {
        labels,
        datasets: [
          {
            label: 'Ingresos de la semana',
            data,
            backgroundColor: '#36A2EB',
          },
        ],
      };
      const chartOptions:ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
          legend: { position: 'top' as const },
          title: {
            display: true,
            text: 'Ingresos de la semana',
          },
        },
      };

      const report = await this.chartService.generateChart(
        'bar',
        chartData,
        chartOptions,
      );

      
      return report
    }catch(e){
      throw new Error(e.message);
    }
  }

  async earningsByProductReport(): Promise<Buffer> {
    try{
    const carts = await this.prisma.cart.findMany({
      where: {
        state: 'CONFIRMED',
      },
      include: {
        cartLine:{ include: { product: true } },
      }
    });
    const productsBySales = await carts.reduce((acc, cart) => {
      cart.cartLine.forEach(async line => {
        if (!acc[line.product.name]) {
          acc[line.product.name] = 0;
        }
        acc[line.product.name] += line.total_price;
      });
      return acc;
  },{});
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
    const chartOptions:ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        title: {
          display: true,
          text: 'Ganancias por producto',
        },
      },
    };

    const report = await this.chartService.generateChart(
      'bar',
      chartData,
      chartOptions,
    );

    
    return report

  } catch(e){
    throw new Error(e.message);
  }
  }
}
