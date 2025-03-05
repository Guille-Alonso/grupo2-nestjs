import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';
import { Response } from 'express';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SUPERADMIN)
@ApiBearerAuth('access-token')
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /*@ApiOperation({ summary: 'Create report' })
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }*/

  @Get()
  findAll(@Query() paginationDto2: PaginationDto2) {
    return this.reportsService.findAll(paginationDto2);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }*/

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }

  @ApiOperation({ summary: 'Sales report' })
  @Get('salesreport/:id')
  async salesReport(@Param('id') id: string) {
    return await this.reportsService.salesReport(id);

  }

  @ApiOperation({ summary: 'Products report' })
  @Get('productsreport/:id')
  async productsReport(@Param('id') id: string) {
    return await this.reportsService.productsReport(id);

  }

  @ApiOperation({ summary: 'Earnings report' })
  @Get('earningsreport/:id')
  async earningsReport(@Param('id') id: string) {
    return await this.reportsService.earningsReport(id);

  }

  @ApiOperation({ summary: 'Earnings by product report' })
  @Get('earningsbyproduct/report/:id')
  async earningsByProductReport(@Param('id') id: string) {
    return await this.reportsService.earningsByProductReport(id);

  }
}
