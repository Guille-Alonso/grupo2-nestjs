import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
      return category;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, pageSize, sortBy, sortOrder } = paginationDto;
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
      throw new Error(error);
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
      throw new Error(error);
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
      return category;
    } catch (error) {
      throw new Error(error);
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
      return category;
    } catch (error) {
      throw new Error(error);
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
      throw new Error(error);
    }
  }

  async assignProductsToCategory(categoryId: string, productIds: string[]) {
    try {
      return await this.prisma.category.update({
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
    } catch (error) {
      throw new Error(error);
    }
  }
}
