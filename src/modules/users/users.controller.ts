import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleEnum } from 'src/common/constants';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCustomOperation } from 'src/common/decorators/swagger.decorator';
import { PaginationDto } from 'src/utils/pagination/dto//pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import CustomError from 'src/utils/custom.error';
import { I18nService } from 'nestjs-i18n';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SUPERADMIN)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly i18n: I18nService) {}

  @ApiCustomOperation({
    summary: 'Create a new user',
    bodyType: CreateUserDto,
    responseStatus: 200,
    responseDescription: 'User created successfully',
  })
  @Post('')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiCustomOperation({
    summary: 'Get all users',
    responseStatus: 200,
    responseDescription: 'Return all users',
  })
  @Get()
  async findAllUserWithPagination(@Query() pagination: PaginationDto) {
    return await this.usersService.findAllUserWithPagination(pagination);
  }

  @ApiCustomOperation({
    summary: 'Get one user',
    responseStatus: 200,
    responseDescription: 'Return one user',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @ApiCustomOperation({
    summary: 'Update a user',
    bodyType: CreateUserDto,
    responseStatus: 200,
    responseDescription: 'Updated user',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @ApiCustomOperation({
    summary: 'Delete a user',
    responseStatus: 200,
    responseDescription: 'Deleted user',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @ApiCustomOperation({
    summary: 'Update/Created user profile',
    bodyType: CreateProfileDto,
    responseStatus: 200,
    responseDescription: 'Updated user profile',
  })
  @Post('update/profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @Req() req: any,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const { userId } = req.user;
    return await this.usersService.updateUserProfile(userId, createProfileDto, file);
  }

  @ApiCustomOperation({
    summary: 'Get all users in excel',
    responseStatus: 200,
    responseDescription: 'Return all users',
  })
  @Get('export/excel')
  async exportAllExcel(@Res() res: Response) {
    return await this.usersService.exportAllExcel(res);
  }

  @ApiCustomOperation({
    summary: 'Upload users from excel',
    responseStatus: 200,
    responseDescription: 'Imported users',
  })
  @Post('upload/excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsers(@UploadedFile() file: Express.Multer.File) {
    try {

      if (!file) {
        throw new CustomError(
          this.i18n.t('messages.fileNotProvided'),
          HttpStatus.BAD_REQUEST
        );
      }
      const data = await this.usersService.uploadUsers(file.buffer);
      return data;
    } catch (error) {
      return error?.message;
    }
  }
}
