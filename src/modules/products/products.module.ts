import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

