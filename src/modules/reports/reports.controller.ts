import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
@Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Create report' })
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Sales report' })
  @Get('sales-report:id')
  salesReport( @Param('id') userId: string) {
    return this.reportsService.salesReport( userId);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Products report' })
  @Get('products-report')
  productsReport() {
    return this.reportsService.productsReport();
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Earnings report' })
  @Get('earnings-report')
  earningsReport() {    
    return this.reportsService.earningsReport();
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Earnings by product report' })
  @Get('earnings-by-product-report')
  earningsByProductReport() {    
    return this.reportsService.earningsByProductReport();
  }
}
