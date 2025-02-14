import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(createImageDto: CreateImageDto) {
    try {
      const image = await this.prisma.image.create({
        data: createImageDto,
      });

      return image;
    } catch (error) {
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      return image;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      const deleteImage = await this.prisma.product.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      return deleteImage;
    } catch (error) {
      throw new Error(error);
    }
  }
}
