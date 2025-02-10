import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Get one category by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @ApiOperation({ summary: 'Get all products of a category' })
  @Get('product/:id')
  findProducts(@Param('id') id: string) {
    return this.categoriesService.findProducts(id);
  }

  @ApiOperation({ summary: 'Assign products to a category' })
  @ApiBody({ schema: { type: 'object', properties: { productIds: { type: 'array', example: ['1a', '2b'] } } } })
  @Patch('assign-products/:id')
  assignProductsToCategory(@Param('id') categoryId: string, @Body('productIds') productIds: string[]) {
    return this.categoriesService.assignProductsToCategory(categoryId, productIds);
  }
}
