import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';

@Module({
  imports:[PaginationModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
