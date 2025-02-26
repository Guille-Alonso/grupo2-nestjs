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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleEnum } from 'src/common/constants';
import { Roles } from 'src/common/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterProductsDto } from './dto/filter-product.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDto })

  @Roles(RoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Roles(RoleEnum.USER, RoleEnum.SUPERADMIN)
  @Get()
  findAll(@Query() paginationDto2: PaginationDto2) {
    return this.productsService.findAll(paginationDto2);
  }

  @Roles(RoleEnum.USER, RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get a product' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete a product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Roles(RoleEnum.USER, RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Filter products' })
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
  @Roles(RoleEnum.SUPERADMIN)
  @Patch('upload-images/:productId')
  uploadImages(
    @Param('productId') productId: string,
    @Body('images') images: string[],
  ) {
    return this.productsService.uploadImages(productId, images);
  }

  @ApiOperation({ summary: 'Delete categories from a product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categorys: {
          type: 'array',
          items: { type: 'string' },
          example: ['Electronics', 'Computers'],
        },
      },
    },
  })
  @Roles(RoleEnum.SUPERADMIN)
  @Patch('delete-categories/:productId')
  deleteCategories(
    @Param('productId') productId: string,
    @Body('categorys') categorys: string[],
  ) {
    return this.productsService.deleteCategories(productId, categorys);
  }

  @ApiOperation({ summary: 'Delete images from a product' })
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
  @Roles(RoleEnum.SUPERADMIN)
  @Patch('delete-images/:productId')
  deteleImages(
    @Param('productId') productId: string,
    @Body('images') images: string[],
  ) {
    return this.productsService.deteleImages(productId, images);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Upload a excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a excel file' })
  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    const data = await this.productsService.uploadProducts(file.buffer);
    return data;
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Export products to excel' })
  @Get('export/excel')
  async exportToExcel(@Res() res: Response) {
    return this.productsService.exportToExcel(res);
  }
}
