import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';
import { ExcelModule } from '../excel/excel.module';
import { CategoriesModule } from '../categories/categories.module';
import { ImagesModule } from '../images/images.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [PaginationModule, ExcelModule, CategoriesModule, ImagesModule, AwsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
