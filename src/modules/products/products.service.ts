import { HttpStatus, Injectable } from '@nestjs/common';
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
import { AwsService } from '../aws/aws.service';
import CustomError from 'src/utils/custom.error';


@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: ExcelService,
    private readonly i18n: I18nService,
    private readonly paginationService: PaginationService,
    private readonly awsService: AwsService,
  ) {}

  async create(newProduct: CreateProductDto) {
    try {
      const { categoryIds, images, ...productData } = newProduct;
      
      const existbarcode = await this.prisma.product.findUnique({
        where: {
          barcode: productData.barcode,
        }
      });
      if(existbarcode){
        const message = this.i18n.t('messages.productBarcodeExist');
        throw new CustomError(message, HttpStatus.BAD_REQUEST);}

      const exitnames = await this.prisma.product.findFirst({
        where: {
          name: productData.name,
        }
      });
      if(exitnames){
        const message = this.i18n.t('messages.productNameExist');
        throw new CustomError(message, HttpStatus.BAD_REQUEST);}


      const categorys = this.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
      });

      const existingCategoryIds = (await categorys).map((p) => p.id);

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
                create: existingCategoryIds.map((id) => ({
                  category: { connect: { id } },
                })),
              }
            : {
                create: []
              },
        },
        include: { categorys: true },
      });
      return { message: (this.i18n.t('messages.productCreated'),product),
       };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productNotCreated');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
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
        }).catch((error) => {
          const messageActionRegister = this.i18n.t('messages.productsNotFound');
          const message = this.i18n.t('messages.genericError', {
          args: { action:messageActionRegister },
           });
          throw new CustomError(
            message,
            HttpStatus.INTERNAL_SERVER_ERROR, // 500
          );
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
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productsNotFound');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
      const product = await this.prisma.product.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        include: { categorys: { include: { category: true } }, images: true },
      });
      if (!product) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
      return product;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.errorProductNotFound');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const { categoryIds, images, ...productData } = updateProductDto;


      
      if(productData.barcode){
        const existbarcode = await this.prisma.product.findUnique({
          where: {
            barcode: productData.barcode,
          }
        }
        );
  
        if(existbarcode){
          const message = this.i18n.t('messages.productBarcodeExist');
          throw new CustomError(message, HttpStatus.BAD_REQUEST);}  
      }

      if (productData.name){
        const exitnames = await this.prisma.product.findFirst({
          where: {
            name: productData.name,
          }
        });

        if(exitnames){
          const message = this.i18n.t('messages.productNameExist');
          throw new CustomError(message, HttpStatus.BAD_REQUEST);}
      }
      
      
      const categorys = this.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
        },
      });

      const existingCategoryIds = (await categorys).map((p) => p.id);

      const existproduct = await this.prisma.product.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        include: { categorys: { include: { category: true } }, images: true },
      })

      if (!existproduct) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

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
          categorys: categoryIds ? {
            deleteMany: {
              productId: id,
            },
            create: existingCategoryIds.map((id) => ({
              category: { connect: { id } },
            })),
          }: {
          },
        },
        include: { categorys: true },
      });
      return {
        message: this.i18n.t('messages.productUpdated'),
        updatedProduct,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productNotUpdated');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async remove(id: string) {
    try {
      const existproduct = await this.prisma.product.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      })

      if (!existproduct) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const deleteProduct = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
          images: {
            update: {
              isDeleted: true,
            },
          },
        },
      });
      
      return { message: this.i18n.t('messages.productDeleted'), deleteProduct };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productNotDeleted');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
    }

  async filterProducts(query: FilterProductsDto) {
    try {
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
      const { skip, take, orderBy } =
        this.paginationService.getPaginationParams(
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.errorProductNotFound');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
    
  }
  async assignCategoriesToProduct(productId: string, names: string[]) {
    try {
      if(!names){const messageActionRegister = this.i18n.t('messages.categorysNotAssigned');
        const message = this.i18n.t('messages.genericError', {
          args: { action:messageActionRegister },
        });
     
        throw new CustomError(
          message,
          HttpStatus.INTERNAL_SERVER_ERROR, // 500
        );}

      const existproduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
          isDeleted: false,
        },
      })

      if (!existproduct) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const categorys = await this.prisma.category.findMany({
        where: {
          name: { in: names,
            mode: 'insensitive' },
          isDeleted: false,
        },
        select: {
          id: true,
        },
      });

      const existingCategoryIds = categorys.map((p) => p.id);

      if (!existingCategoryIds) {
        const message = this.i18n.t('messages.categorysNotFound');
        throw new CustomError(
          message,
           HttpStatus.NOT_FOUND, // 404
         );
      }

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

      if (!newCategoryIds) {
        const message = this.i18n.t('messages.notNewCategorys');
        throw new CustomError(
          message,
           HttpStatus.NOT_FOUND, // 404
         );
      }

      await this.prisma.productOnCategory.createMany({
        data: newCategoryIds.map((categoryId) => ({
          productId,
          categoryId,
        })),
        skipDuplicates: true,
      });

      return {
        message: this.i18n.t('messages.categorysAssigned'),
        product: await this.prisma.product.findUnique({
          where: { id: productId },
          include: { categorys: { include: { category: true } } },
        }),
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categorysNotAssigned');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }
  /*async uploadImages(productId: string, images: string[]) {
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
      const message = this.i18n.t('messages.imagesNotUploaded') + error;
      throw new Error(message);
    }
  }*/

  async deleteCategories(productId: string, categorys: string[]) {
    try {
      if(!productId||productId.length === 0) throw new Error(this.i18n.t('messages.productIdNotFound'))
      if(!categorys||categorys.length === 0) throw new Error(this.i18n.t('messages.categorysNotFound'))

      categorys.forEach((category) => {
        category.charAt(0).toUpperCase();
        category.slice(1).toLowerCase();
      })
      const productexist = await this.prisma.product.findUnique({
        where: {
          id: productId,
          isDeleted: false,
        },
      })

      if (!productexist) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
      
      await this.prisma.productOnCategory.deleteMany({
        where: {
          productId: productId,
          categoryId: { in: categorys },
        },
      });
      return { message: this.i18n.t('messages.categorysDeleted') };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categorysNotDeleted');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async deteleImages(productId: string, images: string[]) {
    try {
      if(!productId||productId.length === 0) throw new Error(this.i18n.t('messages.productIdNotFound'))
      if(!images||images.length === 0) throw new Error(this.i18n.t('messages.imagesNotFound'))
      
        const productexist = await this.prisma.product.findUnique({
          where: {
            id: productId,
            isDeleted: false,
          },
        })
  
        if (!productexist) {
          const message = this.i18n.t('messages.productNotFound');
          throw new CustomError(
           message,
            HttpStatus.NOT_FOUND, // 404
          );
        }
    const colection = await this.prisma.image.findUnique({
      where: { productId },
      select: { colection: true },
    })

    if(!colection) throw new Error(this.i18n.t('messages.productNotFound'))
    
    const newColection = colection.colection.filter((item) => !images.includes(item));

      await this.prisma.image.update({
        where: { productId },
        data: {
          colection: {
            set: newColection,
          },
        },
      });

      return { message: this.i18n.t('messages.imagesDeleted') };
    } catch (error) {
if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.imagesNotDeleted');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }
  async uploadProducts(file: Express.Multer.File) {
    try {
      const{mimetype,buffer}=file

      if (mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        throw new Error(this.i18n.t('messages.wrongFileFormat'));
      }
      const products = await this.excelService.readExcel(buffer);

      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        console.log(product);

        const images: string[] = product.images.replace(/"/g, '').split(',')
        const categorys: string[] = product.categorys.replace(/"/g, '').split(',')
        
        
        const productNew: CreateProductDto = {
          name: product.name.toString(),
          description: product.description.toString(),
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          barcode: product.barcode.toString(),
          sku: product.sku.toString(),
          images: images,
          categoryIds:  categorys,
        };
        console.log(productNew);

        const producto = await this.prisma.product.findMany({
          where: {
            barcode: productNew.barcode,
          },
        })

        if (producto.length === 0) {
          try {
            await this.create(productNew);
          } catch (error) {
            if (error instanceof CustomError) {
            const messageActionRegister = this.i18n.t('messages.productsNotCreated');
            const message = this.i18n.t('messages.genericError', {
            args: { action:messageActionRegister },
            });
              throw new CustomError(
                message,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
          }}
        }else{
          
          console.log('producto existente');
        }
      }
      return { message: this.i18n.t('messages.productsUploaded') };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productsNotUploaded');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async exportToExcel(res: Response) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          isDeleted: false,
        },
        include: { categorys: { select: { category: { select: {id: true, name: true }} } }, images: {select: { colection: true }} },
      });

      const columns: ExcelColumn[] = [
        { header: 'name', key: 'name' },
        { header: 'description', key: 'description' },
        { header: 'price', key: 'price' },
        { header: 'stock', key: 'stock' },
        { header: 'barcode', key: 'barcode' },
        { header: 'sku', key: 'sku' },
        { header: 'categorys', key: 'categorys' },
        { header: 'images', key: 'images' },
      ];
      const workbook = await this.excelService.generateExcel(
        products,
        columns,
        'Productos',
      );

      return this.excelService.exportToResponse(
        res,
        workbook,
        'productos.xlsx',
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.productsNotExported');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }
}
