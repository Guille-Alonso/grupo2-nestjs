import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from 'src/common/constants';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Get()
  findAll(@Query() paginationDto2: PaginationDto2) {
    return this.categoriesService.findAll(paginationDto2);
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @ApiOperation({ summary: 'Get all products of a category' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Get('product/:id')
  findProducts(@Param('id') id: string) {
    return this.categoriesService.findProducts(id);
  }

  @ApiOperation({ summary: 'Assign products to a category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { productIds: { type: 'array', example: ['1a', '2b'] } },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Patch('assign-products/:id')
  assignProductsToCategory(
    @Param('id') categoryId: string,
    @Body('productIds') productIds: string[],
  ) {
    return this.categoriesService.assignProductsToCategory(
      categoryId,
      productIds,
    );
  }
}
