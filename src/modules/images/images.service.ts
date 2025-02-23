import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import CustomError from 'src/utils/custom.error';
import { I18nService } from 'nestjs-i18n';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly i18n: I18nService,
    private readonly awsService: AwsService,
  ) {}
  async create(createImageDto: CreateImageDto) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id: createImageDto.productId, isDeleted: false },select: { id: true } });
      if (product.id == null) {
        const message = this.i18n.t('messages.productNotFound');
        throw new CustomError(message, HttpStatus.BAD_REQUEST); // 400
      }
      const image = await this.prisma.image.create({
        data: createImageDto,
      });
      const message = this.i18n.t('messages.imageCreated')+image;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.imageNotCreated')+error.message;
      throw new Error(message);
    }
  }

  async findAll(paginationDto: PaginationDto2) {
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
        this.prisma.image.findMany({
          where: {
            isDeleted: false,
          },
          skip,
          take,
          orderBy,
        }),
        this.prisma.image.count(),
      ]);

      return this.paginationService.formatPaginatedResponse(
        data,
        total,
        page,
        pageSize,
      );
    } catch (error) {
      const message = this.i18n.t('messages.imagesNotFound');
      throw new Error(message +error.message);
    }
  }

  async findOne(id: string) {
    try {
      const image = await this.prisma.product.findUnique({
        where: {
          id,
        },
      });
      return image;
    } catch (error) {
      const message = this.i18n.t('messages.imageNotFound');
      throw new Error(message +error.message);
    }
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    try {
      const image = await this.prisma.image.update({
        where: {
          id,
        },
        data: updateImageDto,
      });
      const message = this.i18n.t('messages.imageUpdated')+image;
      return message;
    } catch (error) {
      const message = this.i18n.t('messages.imageNotUpdated');
      throw new Error(message +error.message);
    }
  }

  async remove(id: string) {
    //ver si no hay que eliminarla
    try {
      const deleteImage = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      const message = this.i18n.t('messages.imageDeleted');
      return { message, deleteImage };
    } catch (error) {
      throw new Error(error);
    }
  }

  async assignImage(files: Express.Multer.File[], productId: string) {
    try {
    for (const file of files) {
    const { url, key } = await this.awsService.uploadFile(file, productId);
    this.prisma.image.update({
      where: {
        productId,
      },
      data: {
        colection: {
          push: url,
        },
      },
    })
    .catch(async()=>{
      await this.awsService.deleteFile(key);
    console.log('error');
  });
    const message = this.i18n.t('messages.imageAssigned');
    return message;
  }}
  catch (error) {
    const message = this.i18n.t('messages.imageNotAssigned')+error.message;
    throw new Error(message);
  }
  }
}

