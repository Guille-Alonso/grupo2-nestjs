import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PaginationDto2 } from 'src/utils/pagination/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /*@Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Create image' })
  @ApiBody({ type: CreateImageDto })
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }*/

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get all images' })
  @Get()
  findAll(@Query() paginationDto2: PaginationDto2) {
    return this.imagesService.findAll(paginationDto2);
  }

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Get image by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  /*@Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Update image' })
  @ApiBody({ type: UpdateImageDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(id, updateImageDto);
  }
*/
  /*@Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Delete image' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }*/

  @Roles(RoleEnum.SUPERADMIN)
  @ApiOperation({ summary: 'Assign image to product' })
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('assignimage/:productId')
  async assignImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('productId') productId: string,
  ) {
    return await this.imagesService.assignImage(files, productId);
  }
}
