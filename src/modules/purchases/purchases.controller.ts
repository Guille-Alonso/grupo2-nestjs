import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles(RoleEnum.SUPERADMIN)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

@ApiCustomOperation({
      summary: 'Create a new purchases, need SUPERADMIN rol',
      bodyType: CreatePurchaseDto,
      responseStatus: 201,
      responseDescription: 'purchases created created',
    })
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() req) {
    const {userId} =req.user;
    return this.purchasesService.create(createPurchaseDto, userId);
  }

  @ApiCustomOperation({
    summary: 'get all purchases',
    responseStatus: 201,
    responseDescription: 'purchases',
  })
  @Get()
  findAll(@Req() req) {
    const {userId} = req.user;
    return this.purchasesService.findAll(userId);
  }
}
