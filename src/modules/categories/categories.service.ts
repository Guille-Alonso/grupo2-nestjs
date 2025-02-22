import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly i18n: I18nService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
      const message = this.i18n.t('messages.categoryCreated')+
      category;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.categoryNotCreated')+error.message;
      throw new Error(message);
    }
  }

  async findAll(paginationDto: PaginationDto2) {
    try {
      const { page, pageSize, sortBy, sortOrder } = paginationDto;
      console.log(paginationDto,page, pageSize, sortBy, sortOrder);
      const { skip, take, orderBy } =
        this.paginationService.getPaginationParams(
          page,
          pageSize,
          sortBy,
          sortOrder,
        );

      const [data, total] = await Promise.all([
        this.prisma.category.findMany({
          where: {
            isDeleted: false,
          },
          skip,
          take,
          orderBy,
        }),
        this.prisma.category.count(),
      ]);

      return this.paginationService.formatPaginatedResponse(
        data,
        total,
        page,
        pageSize,
      );
    } catch (error) {
      const message = this.i18n.t('messages.categoriesNotFound')+error.message;
      throw new Error(message);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      });
      return category;
    } catch (error) {
      const message = this.i18n.t('messages.categoryNotFound')+error.message;
      throw new Error(message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: {
          id,
        },
        data: updateCategoryDto,
      });
      const message = this.i18n.t('messages.categoryUpdated')+category;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.categoryNotUpdated')+error.message;
      throw new Error(message);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      const message = this.i18n.t('messages.categoryDeleted')+category;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.categoryNotDeleted')+error.message;
      throw new Error(message);
    }
  }

  async findProducts(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      return category.products.map((relation) => relation.product.name);
    } catch (error) {
      const message = this.i18n.t('messages.productsNotFound')+error.message;
      throw new Error(message);
    }
  }

  async assignProductsToCategory(categoryId: string, productIds: string[]) {
    try {
      const category = await this.prisma.category.update({
        where: { id: categoryId },
        data: {
          products: {
            create: productIds.map((productId) => ({
              product: { connect: { id: productId } },
            })),
          },
        },
        include: { products: { include: { product: true } } },
      });
      const message = this.i18n.t('messages.categoryUpdated')+
      category;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.categoryNotUpdated')+error.message;
      throw new Error(message);
    }
  }
}
