import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.USER)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll(@Req() req) {
    const {userId}= req.user;
    return this.cartService.findAll(userId);
  }
  @Roles(RoleEnum.SUPERADMIN)
  @Get("allCart")
  findAllAdmin(){
    return this.cartService.findAllAdmin();
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
