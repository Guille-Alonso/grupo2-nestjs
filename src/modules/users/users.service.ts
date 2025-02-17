import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelColumn } from 'src/common/interfaces';
import { ExcelService } from '../excel/excel.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { Prisma, Role } from '@prisma/client';
import { getPaginationFilter } from 'src/utils/pagination/pagination.utils';
import { I18nService } from 'nestjs-i18n';
import { Paginate } from 'src/utils/parsing';
import { hashPassword } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';
import CustomError from 'src/utils/custom.error';

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
 
      if (!user.email || !user.password || !user.name || !user.lastName) {
        throw new CustomError('Todos los campos son obligatorios.', HttpStatus.BAD_REQUEST); // 400
      }
      
      const userExists = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: user.email,
            mode: 'insensitive',
          },
        },
      });
      
  
      if (userExists) {
        throw new CustomError('El email ya está registrado.', HttpStatus.CONFLICT); // 409
      }
      
      const hashedPassword = await hashPassword(user.password);
      const email = user.email.toLowerCase();
  
      const newUser = await this.prisma.user.create({
        data: {
          ...user,
          email,
          password: hashedPassword,
        },
      });
  
      try {
        await this.messagingService.sendRegisterUserEmail({
          from: messagingConfig.emailSender,
          to: email,
        });
      } catch (emailError) {
    
        throw new CustomError(
          'Hubo un error al intentar enviar el correo de registro. Usuario creado correctamente.',
          HttpStatus.CREATED, // 201
        );
      }

      return {
        message: 'Usuario creado correctamente',
        userId: newUser.id,
      };
      
    } catch (error) {
    
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al crear el usuario. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          isDeleted: false,
        },
      });

      if (!Array.isArray(users) || users.length === 0) {
        throw new CustomError(
          'No se encontraron usuarios.',
          HttpStatus.NOT_FOUND, // 404
        );
      }      

      return users;
      
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al obtener usuarios. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async findAllUserWithPagination(pagination: PaginationDto) {
    try {
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

      if (total === 0) {
        throw new CustomError(
          'No se encontraron usuarios que coincidan con el criterio de búsqueda.',
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const dataUsers = await this.prisma.user.findMany(baseQuery);

      if (!Array.isArray(dataUsers) || dataUsers.length === 0) {
        throw new CustomError(
          'No se encontraron usuarios.',
          HttpStatus.NOT_FOUND, // 404
        );
      }
      
  
      const res = Paginate(dataUsers, total, pagination);

      // const userName = 'Joe';
      // const message = this.i18n.t('messages.welcome', {
      //   args: { name: userName },
      // });
   
      return res;

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al obtener usuarios. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
  
      if(!user){
        throw new CustomError(
          'Usuario no encontrado.',
          HttpStatus.NOT_FOUND, // 404
        );
      }
      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al buscar el usuario. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
   
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
  
      if (!existingUser) {
        throw new CustomError('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.email) {
     
        const userExists = await this.prisma.user.findFirst({
          where: {
            email: {
              equals: updateUserDto.email,
              mode: 'insensitive',
            },
          },
        });
        
        if (userExists && userExists.id !== id) {
          throw new CustomError(
            'El email ya está registrado.',
            HttpStatus.CONFLICT, // 409
          );
        }

        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: {
            ...updateUserDto,
            email: { set: updateUserDto.email.toLowerCase() },
          },
        });

        return {
          message: 'Usuario modificado correctamente',
          user: updatedUser,
        };
      } else {
        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: updateUserDto,
        });

        return {
          message: 'Usuario modificado correctamente',
          user: updatedUser,
        };
      }

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al actualizar el usuario. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async remove(id: string) {
    try {
      
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
  
      if (!existingUser) {
        throw new CustomError('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      const deletedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });

      return {
        message: 'Usuario eliminado correctamente',
        user: deletedUser,
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al eliminar el usuario. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  // FALTA VALIDAR
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
