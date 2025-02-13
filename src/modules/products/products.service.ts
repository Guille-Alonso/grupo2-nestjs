import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ExcelService } from 'src/modules/excel/excel.service';
import { I18nService } from 'nestjs-i18n';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { ExcelColumn } from 'src/common/interfaces';
import { FilterProductsDto } from './dto/filter-product.dto';
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
      return {message: this.i18n.t('messages.productCreated'),product};
    } catch (error) {
      const message=  this.i18n.t('messages.productNotCreated')+error;
      throw new Error(message);
    }
  }

  async findAll(paginationDto2: PaginationDto2) {
    try {
      const { page, pageSize, sortBy, sortOrder } = paginationDto2;
      const { skip, take, orderBy } =
        this.paginationService.getPaginationParams(
          page,
          pageSize,
          sortBy,
          sortOrder,
        );

      const [data, total] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            isDeleted: false,
          },
          skip,
          take,
          orderBy,
        }),
        this.prisma.product.count(),
      ]);

      return this.paginationService.formatPaginatedResponse(
        data,
        total,
        page,
        pageSize,
      );
    } catch (error) {
      const message=  this.i18n.t('messages.productsNotFound')+error;
      throw new Error(message);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id,
        },
        include: { categorys: { include: { category: true } }, images: true },
      });
      return product;
    } catch (error) {
      const message=  this.i18n.t('messages.productNotFound')+error;
      throw new Error(message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { categoryIds, images, ...productData } = updateProductDto;
      const updatedProduct = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          ...productData,
          images: {
            update: {
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
      return{message: this.i18n.t('messages.productUpdated'),updatedProduct};
    } catch (error) {
      const message=  this.i18n.t('messages.productNotCreated')+error;
      throw new Error(message);
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
      return {message: this.i18n.t('messages.productDeleted'),deleteProduct};
    } catch (error) {
      const message=  this.i18n.t('messages.productNotDeleted')+error;
      throw new Error(message);
    }
  }

  async filterProducts(query: FilterProductsDto) {
    try{
    const {
      name,
      sku,
      minPrice,
      maxPrice,
      category,
      page,
      pageSize,
      sortBy,
      sortOrder,
    } = query;
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
  }catch (error) {
    const message=  this.i18n.t('messages.productsNotFound')+error;
    throw new Error(message);
  }
}
  async assignCategoriesToProduct(productId: string, names: string[]) {
    try {
      const categorys = await this.prisma.category.findMany({
        where: {
          name: { in: names },
        },
        select: {
          id: true,
        },
      });

      const existingCategoryIds = categorys.map((p) => p.id);

      const productCategories = await this.prisma.productOnCategory.findMany({
        where: {
          productId: productId,
          categoryId: { in: existingCategoryIds },
        },
        select: { categoryId: true },
      });

      const assignedCategoryIds = productCategories.map((pc) => pc.categoryId);
      const newCategoryIds = existingCategoryIds.filter(
        (id) => !assignedCategoryIds.includes(id),
      );

      if (newCategoryIds.length === 0) {
        return { message: this.i18n.t('messages.notNewCategorys') };
      }

      await this.prisma.productOnCategory.createMany({
        data: newCategoryIds.map((categoryId) => ({
          productId,
          categoryId,
        })),
        skipDuplicates: true,
      });

      return{message: this.i18n.t('messages.categorysAssigned'),product: await this.prisma.product.findUnique({
        where: { id: productId },
        include: { categorys: { include: { category: true } } },
      })};
    } catch (error) {
      const message=  this.i18n.t('messages.categorysNotAssigned')+error;
      throw new Error(message);
    }
  }
  async uploadImages(productId: string, images: string[]) {
    try {
      const assignedImages = await this.prisma.image.findMany({
        where: {
          productId: productId,
        },
        select: { colection: true },
      });

      const colection = assignedImages[0].colection;

      const newColection = images.filter((item) => !colection.includes(item));

      if (newColection.length === 0) {
        return { message: this.i18n.t('messages.notNewImages') };
      }

      await this.prisma.image.update({
        where: { productId },
        data: {
          colection: {
            push: newColection,
          },
        },
      });
      return { message: this.i18n.t('messages.imagesUploaded') };
    } catch (error) {
      const message=  this.i18n.t('messages.imagesNotUploaded')+error;
      throw new Error(message);
    }
  }

  async uploadProducts(buffer: Buffer) {
    try {
      const products = await this.excelService.readExcel(buffer);

      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const productNew = {
          ...product,
          price: parseFloat(product.price),
        };
        await this.create(productNew as CreateProductDto);
        //await this.prisma.product.create({ data: productNew });
      }
      return { message: this.i18n.t('messages.productsUploaded') };
    } catch (error) {
      const message=  this.i18n.t('messages.productsNotUploaded')+error;
      throw new Error(message);
    }
  }

  async exportToExcel(res: Response) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          isDeleted: false,
        },
        include: { categorys: { include: { category: true } }, images: true },
      });

      const columns: ExcelColumn[] = [
        { header: 'Name', key: 'name' },
        { header: 'Description', key: 'description' },
        { header: 'Price', key: 'price' },
        { header: 'Stock', key: 'stock' },
        { header: 'Barcode', key: 'barcode' },
        { header: 'SKU', key: 'sku' },
        { header: 'Categorys', key: 'categorys' },
        { header: 'Images', key: 'images' },
      ];
      const workbook = await this.excelService.generateExcel(
        products,
        columns,
        'Productos',
      );
      const buffer = await Buffer.from(await workbook.xlsx.writeBuffer());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'productos.xlsx',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
        buffer: buffer,
        destination: '',
        filename: '',
        path: '',
        stream: null,
      };
      /*const { url } = await this.awsService.uploadFile(file, 'excel');
    await this.prisma.report.create({
      data: { content: url, type: 'Usuario' },
    });*/
      await this.excelService.exportToResponse(res, workbook, 'productos.xlsx');
      return { message: this.i18n.t('messages.productsExported') };
    } catch (error) {
      const message=  this.i18n.t('messages.productsNotExported')+error;
      throw new Error(message);
    }
  }
}
