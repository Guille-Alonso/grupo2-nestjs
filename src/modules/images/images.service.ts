import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor( private readonly prisma: PrismaService,) {}
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

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} on ${updateImageDto} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
