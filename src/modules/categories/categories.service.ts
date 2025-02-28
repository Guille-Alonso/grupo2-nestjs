import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { I18nService } from 'nestjs-i18n';
import CustomError from 'src/utils/custom.error';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly i18n: I18nService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const existCategory=await this.prisma.category.findUnique({
        where: {
          name: createCategoryDto.name,
        },
      })
      if(existCategory){
        const message = this.i18n.t('messages.categoryNameExist');
        throw new CustomError(message, HttpStatus.BAD_REQUEST);
      }
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
      const message = this.i18n.t('messages.categoryCreated')+ '\n' + JSON.stringify(category, null, 2);
      return message;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categoryNotCreated');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
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
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categoryNotFound');
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
      const category = await this.prisma.category.findUnique({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (!category) {
        const message = this.i18n.t('messages.categoryIdNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );}
      return category;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categoryNotFound');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
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
      if (!category) {
        const message = this.i18n.t('messages.categoryIdNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );}

      const message = this.i18n.t('messages.categoryUpdated');
      return {message,
        category
      };
    } catch (error) {
if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categoryNotFound');
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
      const category = await this.prisma.category.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      if (!category) {
        const message = this.i18n.t('messages.categoryIdNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );}
      const message = this.i18n.t('messages.categoryDeleted');
      return { 
        message, 
        category 
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.categoryNotDeleted');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
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

      if(!category||category.products.length===0){
        const message = this.i18n.t('messages.productsNotFound');
        throw new CustomError(message, HttpStatus.NOT_FOUND);;
      }

      return category.products.map((relation) => relation.product.name);
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

  async assignProductsToCategory(categoryId: string, productIds: string[]) {
    try {
      if (!productIds || productIds.length === 0) {
        const message = this.i18n.t('messages.productsNotFound');
        throw new CustomError(message, HttpStatus.NOT_FOUND);
      }
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
      if (!category) {
        const message = this.i18n.t('messages.categoryIdNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );}

      const message = this.i18n.t('messages.categoryUpdated')+category.products;
      return {message};
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
}
