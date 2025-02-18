import { ExecutionContext, Injectable } from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChartService } from '../chart/chart.service';
import { AwsService } from '../aws/aws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
import { ChartConfiguration } from 'chart.js';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chartService: ChartService,
    private readonly awsService: AwsService,
    private readonly jwtService: JwtService,
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

  async salesReport( ) {
    try {
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
        acc[date] += 1;
        return acc;
      },{});

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
      const pdfReport:Express.Multer.File={
        fieldname: "file",
        originalname: "report.pdf", 
        encoding: "7bit", 
        mimetype: "application/pdf", 
        buffer: report,
        size: report.length,
        destination: "",
        filename: "",
        path: "",
        stream: null
      }
      const{url}= await this.awsService.uploadFile(pdfReport, 'report', 'user');
      const context: ExecutionContext = {} as ExecutionContext;
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization.split(' ')[1];
      const payload: JwtPayload = await this.jwtService.decode(token);
      const userId = payload.id;

      const reportdto:CreateReportDto= {
        content: url,
        type: 'VentaTotal',
        userId
      }
      this.create(reportdto);
      
      return { Message: 'reporte generado',
        report
       };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async productsReport() {
    try{
      const carts = await this.prisma.cart.findMany({
        where: {
          state: 'CONFIRMED',
        },
        include: {
          cartLine:{ include: { product: true } },
        }
      })
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

    return await this.chartService.generateChart(
      'bar',
      chartData,
      chartOptions,
    );

    }catch(e){
      throw new Error(e.message);
    }
  }

  async earningsReport() {
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
    }catch(e){
      throw new Error(e.message);
    }
  }

  async earningsByProductReport() {
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

  } catch(e){
    throw new Error(e.message);
  }
  }
}
