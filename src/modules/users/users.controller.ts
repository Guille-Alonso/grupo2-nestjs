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
import { UpdateProfileDto } from './dto/create-profile.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SUPERADMIN)

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiCustomOperation({
    summary: 'get all users',
    responseStatus: 200,
    responseDescription: 'Return all users',
  })
  @Get()
  findAllUserWithPagination(@Query() pagination: PaginationDto) {
    return this.usersService.findAllUserWithPagination(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('update/profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { userId } = req.user;
    await this.usersService.updateUserProfile(userId, updateProfileDto, file);
  }

  @Get('export/excel')
  async exportAllExcel(@Res() res: Response) {
  
    return this.usersService.exportAllExcel(res);
  }

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
