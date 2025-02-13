import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll(@Req() req:any) {

    const userId = req.userId.id;
    return this.cartService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch('confirm/:id')
  update(@Param('id') id: string) {
    return this.cartService.comfirmCart(id);
  }

  @Delete('cancel/:id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
