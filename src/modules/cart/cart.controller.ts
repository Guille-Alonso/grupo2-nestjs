import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { Response } from 'express';


@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles(RoleEnum.USER)
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
  findAll(@Req() req, @Query() paginationDto2: PaginationDto2) {
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
  findAllAdmin(@Query() paginationDto2: PaginationDto2){
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
  async update(@Param('id') id: string, @Res() res: Response): Promise<void> {
      try {
          const pdfBuffer = (await this.cartService.comfirmCart(id));
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=carrito_confirm.pdf');
          res.status(HttpStatus.OK).send(pdfBuffer);
      } catch (error) {
          console.error(error);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
              message: 'Error al generar el PDF',
              error: error.message, 
          });
      }
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
