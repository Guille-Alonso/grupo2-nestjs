import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ExcelService } from 'src/modules/excel/excel.service';
import { I18nService } from 'nestjs-i18n';
import { FilterProductsDto } from './dto/filter-product.dto';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: ExcelService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
  ) {}


  async create(newProduct: CreateProductDto) {
    try {
      const { categoryIds, images, ...productData } = newProduct;
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          images: {
            create: {
              colection: images,
            },
          },
          categorys: categoryIds
            ? {
                create: categoryIds.map((id) => ({
                  category: { connect: { id } },
                })),
              }
            : undefined,
        },
        include: { categorys: true },
      });
      return product;
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
        this.prisma.product.findMany({ skip, take, orderBy }),
        this.prisma.product.count(),
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
      const product = await this.prisma.product.findUnique({
        where: {
          id,
        },
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { images, ...productData } = updateProductDto;
      const updatedProduct = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          ...productData,
          images: {
            create: {
              colection: images,
            },
          },
        },
      });
      return updatedProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      const deleteProduct = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      return deleteProduct;
    } catch (error) {
      throw new Error(error);
    }
  }

  async filterProducts(
    filterDto: FilterProductsDto,
    paginationDto: PaginationDto,
  ) {
    const { name, sku, minPrice, maxPrice, category } = filterDto;
    const { page, pageSize, sortBy, sortOrder } = paginationDto;
    const { skip, take, orderBy } = this.paginationService.getPaginationParams(
      page,
      pageSize,
      sortBy,
      sortOrder,
    );

    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      name: name
        ? ({ contains: name, mode: 'insensitive' } as Prisma.StringFilter)
        : undefined,
      sku: sku ? ({ equals: sku } as Prisma.StringFilter) : undefined,
      price: {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined,
      },
      categorys: category
        ? {
            some: {
              category: {
                name: {
                  contains: category,
                  mode: 'insensitive',
                } as Prisma.StringFilter,
              },
            },
          }
        : undefined,
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy, // Aplicamos la ordenación
        include: {
          images: true,
          categorys: { include: { category: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return this.paginationService.formatPaginatedResponse(
      data,
      total,
      page,
      pageSize,
    );
  }

  async assignCategoriesToProduct(productId: string, categoryIds: string[]) {
    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          categorys: {
            connect: categoryIds.map((categoryId) => ({
              productId_categoryId: { productId, categoryId }, // Ajusta según el nombre de la clave compuesta
            })),
          },
        },
        include: { categorys: { include: { category: true } } },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async uploadImages(productId: string, images: string[]) {
    try {
      await this.prisma.image.update({
        where: { productId },
        data: {
          colection: {
            push: images,
          },
        },
      });
      return { message: 'Imagenes creadas correctamente' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadProducts(buffer: Buffer) {
    const products = await this.excelService.readExcel(buffer);

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const productNew = {
        ...product,
        price: parseFloat(product.price),
      };
      await this.prisma.product.create({ data: productNew });
    }
    return { message: 'Productos creados correctamente' };
  }
}
