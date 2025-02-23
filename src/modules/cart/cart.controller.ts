import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.USER, RoleEnum.SUPERADMIN)
@ApiBearerAuth('access-token')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBody({type: CreateCartDto})
   @ApiCustomOperation({
      summary: 'Create a new cart',
      bodyType: CreateCartDto,
      responseStatus: 201,
      responseDescription: 'Cart created',
    })
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  
    @ApiCustomOperation({
      summary: "get all the user's carts, need userId",
      responseStatus: 200,
      responseDescription: 'cart found',
    })
    @ApiQuery({ name: 'id', description: 'User Id', example: 'b5e0211f-0105-4ae1-ba67-9edqw9a9b4f1' })
  @Get()
  findAll(@Req() req,  paginationDto2: PaginationDto2) {
    const {userId}= req.user;
    return this.cartService.findAll(userId, paginationDto2);
  }

  @ApiCustomOperation({
    summary: "get all carts, need SUPERADMIN rol",
    responseStatus: 200,
    responseDescription: 'cart found',
  })
  @Roles(RoleEnum.SUPERADMIN)
  @Get("allCart")
  findAllAdmin(paginationDto2: PaginationDto2){
    return this.cartService.findAllAdmin(paginationDto2);
  }

  @ApiCustomOperation({
    summary: "get one cart",
    responseStatus: 200,
    responseDescription: 'cart found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }


  @ApiCustomOperation({
    summary: "confirm a cart",
    responseStatus: 202,
    responseDescription: 'cart found',
  })
  @Patch('confirm/:id')
  update(@Param('id') id: string) {
    return this.cartService.comfirmCart(id);
  }


  @ApiCustomOperation({
    summary: "cancel cart",
    responseStatus: 200,
    responseDescription: 'cart found',
  })
  @Delete('cancel/:id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
