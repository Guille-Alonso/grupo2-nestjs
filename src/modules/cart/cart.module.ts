import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';
import { PrinterModule } from '../printer/printer.module';

@Module({
  imports:[PaginationModule, PrinterModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
