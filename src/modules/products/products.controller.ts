import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterProductsDto } from './dto/filter-product.dto';

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
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(RoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiCustomOperation({
    summary: 'Get all products',
    responseStatus: 200,
    responseDescription: 'Products found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Get()
  findAll(@Query() paginationDto2: PaginationDto2) {
    return this.productsService.findAll(paginationDto2);
  }

  @ApiOperation({ summary: 'Get a product' })
  @ApiCustomOperation({
    summary: 'Get a product',
    responseStatus: 200,
    responseDescription: 'Product found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: UpdateProductDto })
  @ApiCustomOperation({
    summary: 'Update a product',
    bodyType: CreateProductDto,
    responseStatus: 200,
    responseDescription: 'Product updated',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiCustomOperation({
    summary: 'Delete a product',
    responseStatus: 200,
    responseDescription: 'Product deleted',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: 'Filter products' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Post('filter')
  filter(@Query() filter: FilterProductsDto) {
    return this.productsService.filterProducts(filter);
  }

  @ApiOperation({ summary: 'Assign categories to a product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        names: {
          type: 'array',
          items: { type: 'string' },
          example: ['Electronics', 'Computers'],
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Patch('assign-categories/:productId')
  assignCategoriesToProduct(
    @Param('productId') productId: string,
    @Body('names') names: string[],
  ) {
    return this.productsService.assignCategoriesToProduct(productId, names);
  }

  @ApiOperation({ summary: 'Upload images to a product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
          ],
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Patch('upload-images/:productId')
  uploadImages(
    @Param('productId') productId: string,
    @Body('images') images: string[],
  ) {
    return this.productsService.uploadImages(productId, images);
  }

  @ApiOperation({ summary: 'Upload a excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a excel file' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    const data = await this.productsService.uploadProducts(file.buffer);
    return data;
  }

  @ApiOperation({ summary: 'Export products to excel' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Get('export/excel')
  async exportToExcel(@Res() res: Response) {
    return this.productsService.exportToExcel(res);
  }
}
