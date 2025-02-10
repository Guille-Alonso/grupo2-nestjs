import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { productIds, ...categoryData } = createCategoryDto;
      const category = await this.prisma.category.create({
        data: {
          ...categoryData,
          isDeleted: false,
          products: productIds
            ? {
                create: productIds.map((id) => ({
                  product: { connect: { id } },
                })),
              }
            : undefined,
        },
        include: { products: true },
      });
      return category;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const category = await this.prisma.category.findMany({
        where: {
          isDeleted: false,
        },
      });
      return category;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id,
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
