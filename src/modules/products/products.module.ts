import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [PaginationModule, ExcelModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

