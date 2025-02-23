import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ChartModule } from '../chart/chart.module';
import { AwsModule } from '../aws/aws.module';
import { PrinterModule } from '../printer/printer.module';

@Module({
  imports: [ChartModule,AwsModule,PrinterModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
