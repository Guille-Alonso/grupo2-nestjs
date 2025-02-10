import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { FilterProductsDto } from './dto/filter-product.dto';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCustomOperation({
    summary: 'Create a product',
    bodyType: CreateProductDto,
    responseStatus: 201,
    responseDescription: 'Product created',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiBody({ type: CreateProductDto })
  @ApiCustomOperation({
    summary: 'Get all products',
    bodyType: CreateProductDto,
    responseStatus: 200,
    responseDescription: 'Products found',
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCustomOperation({
    summary: 'Get a product',
    bodyType: CreateProductDto,
    responseStatus: 200,
    responseDescription: 'Product found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCustomOperation({
    summary: 'Update a product',
    bodyType: CreateProductDto,
    responseStatus: 200,
    responseDescription: 'Product updated',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCustomOperation({
    summary: 'Delete a product',
    bodyType: CreateProductDto,
    responseStatus: 200,
    responseDescription: 'Product deleted',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: 'filter products by category, name, price or sku' })
  @ApiBody({ type: FilterProductsDto })
  @ApiCustomOperation({
    summary: 'filter products by category, name, price or sku',
    bodyType: FilterProductsDto,
    responseStatus: 200,
    responseDescription: 'Products found',
  })
  @Get('/filter')
  filterProducts(@Query() filterDto: FilterProductsDto, @Query() paginationDto: PaginationDto) {
    return this.productsService.filterProducts(filterDto, paginationDto);
  }

  @ApiOperation({ summary: 'Assign categories to a product' })
  @ApiBody({ schema: { type: 'object', properties: { categoryIds: { type: 'array', example: ['1a', '2b'] } } } })
  @Patch('assign-categories/:id')
  assignCategoriesToProduct(@Param('id') productId: string, @Body('categoryIds') categoryIds: string[]) {
    return this.productsService.assignCategoriesToProduct(productId, categoryIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsers(@UploadedFile() file: Express.Multer.File) {
    const data = await this.productsService.uploadProducts(file.buffer);
    return data;
  }
}
