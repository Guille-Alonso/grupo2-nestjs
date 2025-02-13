import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelColumn } from 'src/common/interfaces';
import { ExcelService } from '../excel/excel.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { getPaginationFilter } from 'src/utils/pagination/pagination.utils';
import { I18nService } from 'nestjs-i18n';
import { Paginate } from 'src/utils/parsing';
import { hashPassword } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
    private readonly excelService: ExcelService,
    private readonly i18n: I18nService,
    private messagingService: MessagingService,
  ) {}

    async create(user: CreateUserDto) {
      try {
        const findUser = await this.prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
  
        if (findUser) {
          throw new Error('Email ya registrado.');
        }
  
        await this.prisma.user.create({
          data: {
            ...user,
            password: await hashPassword(user.password),
          },
        });

        this.messagingService.sendRegisterUserEmail({
          from: messagingConfig.emailSender,
          to: user.email,
        });

        return {
          message: 'Se creo correctamente',
        };
      } catch (error) {
        throw new Error(error);
      }
    }

  findAll() {
    const users = this.prisma.user.findMany({
      where: {
        isDeleted: false,
      },
    });
    return users;
  }

  async findAllUserWithPagination(pagination: PaginationDto) {
    const { search } = pagination;

    const where: Prisma.UserWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const baseQuery = {
      where,
      ...getPaginationFilter(pagination),
    };

    const total = await this.prisma.user.count({ where });
    const dataUsers = await this.prisma.user.findMany(baseQuery);

    const res = Paginate(dataUsers, total, pagination);
    const userName = 'Joe';
    const message = this.i18n.t('messages.welcome', {
      args: { name: userName },
    });
    console.log('message', message);
    return res;
  }

  findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return updatedUser;
  }

  remove(id: string) {
    const deletedUser = this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return deletedUser;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const { url, key } = await this.awsService.uploadFile(file, id);
    console.log(url);

    const user = await this.prisma.user
      .update({
        where: {
          id,
        },
        data: { ...updateUserDto },
      })
      .catch(async () => {
        await this.awsService.deleteFile(key);
        console.log('Error');
        await this.prisma.user.update({
          where: {
            id,
          },
          data: { },
        });
      });
    return user;
  }

  async exportAllExcel(res: Response, userId: string) {
    const users = await this.findAll();

    const columns: ExcelColumn[] = [
      { header: 'Nombre', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Telefono', key: 'phone' },
      { header: 'Rol de Usuario', key: 'role' },
    ];

    const workbook = await this.excelService.generateExcel(
      users,
      columns,
      'Usuarios',
    );
    const buffer = await Buffer.from(await workbook.xlsx.writeBuffer());
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'usuarios.xlsx',
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
    const { url } = await this.awsService.uploadFile(file, 'excel');
    await this.prisma.report.create({
      data: { content: url, type: 'Usuario', userId: userId },
    });
    await this.excelService.exportToResponse(res, workbook, 'usuarios.xlsx');
  }

  async uploadUsers(buffer: Buffer) {
    const users = await this.excelService.readExcel(buffer);
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      await this.create(element);
    }
    return { message: 'Usuarios creados correctamente' };
  }
}
