import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AwsService } from '../aws/aws.service';
import { ExcelColumn } from 'src/common/interfaces';
import { ExcelService } from '../excel/excel.service';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { Prisma, Profile, Role } from '@prisma/client';
import { getPaginationFilter } from 'src/utils/pagination/pagination.utils';
import { I18nService } from 'nestjs-i18n';
import { Paginate } from 'src/utils/parsing';
import { hashPassword } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { awsConfig, messagingConfig } from 'src/common/constants';
import CustomError from 'src/utils/custom.error';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProfileDto } from './dto/create-profile.dto';

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
        const message = this.i18n.t('messages.incompleteRegister');
        throw new CustomError(message, HttpStatus.BAD_REQUEST); // 400
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
        const message = this.i18n.t('messages.existingEmail');
        throw new CustomError(message, HttpStatus.CONFLICT); // 409
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
          name: user.name
        });
      } catch (emailError) {
        const message = this.i18n.t('messages.sendEmailError');
        throw new CustomError(
          message,
          HttpStatus.CREATED, // 201
        );
      }

      const message = this.i18n.t('messages.successfulRegistration');
      return {
        message,
        userId: newUser.id,
      };
      
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageActionRegister = this.i18n.t('messages.messageActionRegister');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRegister },
      });
   
      throw new CustomError(
        error?.message || message,
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
        const message = this.i18n.t('messages.usersNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }      

      return users;
      
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionFindUser },
      });
   
      throw new CustomError(
        error?.message || message,
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
        const message = this.i18n.t('messages.usersNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const dataUsers = await this.prisma.user.findMany(baseQuery);

      if (!Array.isArray(dataUsers) || dataUsers.length === 0) {
        const message = this.i18n.t('messages.usersNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
      
  
      const res = Paginate(dataUsers, total, pagination);
   
      return res;

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionFindUser },
      });
   
      throw new CustomError(
        error?.message || message,
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
        const message = this.i18n.t('messages.userNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
      
      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      const messageActionFindUser = this.i18n.t('messages.messageActionFindUser');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionFindUser },
      });
   
      throw new CustomError(
        error?.message || message,
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
        const message = this.i18n.t('messages.userNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
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
          const message = this.i18n.t('messages.existingEmail');
          throw new CustomError(message, HttpStatus.CONFLICT); // 409
        }

        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: {
            ...updateUserDto,
            email: { set: updateUserDto.email.toLowerCase() },
          },
        });

        const message = this.i18n.t('messages.userSuccessfullyUpdated');

        return {
          message,
          user: updatedUser,
        };

      } else {
        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: updateUserDto,
        });

        const message = this.i18n.t('messages.userSuccessfullyUpdated');

        return {
          message,
          user: updatedUser,
        };
      }

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionUpdateUser = this.i18n.t('messages.messageActionUpdateUser');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionUpdateUser },
      });
   
      throw new CustomError(
        error?.message || message,
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
        const message = this.i18n.t('messages.userNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const deletedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });

      const message = this.i18n.t('messages.userSuccessfullyDeleted');

      return {
        message,
        user: deletedUser,
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionDeleteUser = this.i18n.t('messages.messageActionDeleteUser');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionDeleteUser },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  // FALTA VALIDAR y vincular con PROFILE
  // async updateUserProfile(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  //   file: Express.Multer.File,
  // ) {
  //   const { url, key } = await this.awsService.uploadFile(file, id);
  //   console.log(url);

  //   const user = await this.prisma.user
  //     .update({
  //       where: {
  //         id,
  //       },
  //       data: { ...updateUserDto },
  //     })
  //     .catch(async () => {
  //       await this.awsService.deleteFile(key);
  //       console.log('Error');
  //       await this.prisma.user.update({
  //         where: {
  //           id,
  //         },
  //         data: {},
  //       });
  //     });
  //   return user;
  // }
 
  private extractFileKeyFromUrl(url: string): string {
    const baseUrl = `https://${awsConfig.s3.bucket}.s3.${awsConfig.client.region}.amazonaws.com/`;
    return url.replace(baseUrl, ''); // 🔹 Elimina la parte base de la URL
  }
  
  
  async updateUserProfile(
    id: string,
    updateUserDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    try {
      let existingProfile = await this.prisma.profile.findUnique({
        where: { userId: id },
      });
  
      let uploadResult = null;
  
      // if (file) {
      //   if (existingProfile?.photo) {
      //     const oldPhotoKey = this.extractFileKeyFromUrl(existingProfile.photo);
      //     await this.awsService.deleteFile(oldPhotoKey);
      //   }
  
      //   uploadResult = await this.awsService.uploadFile(file, id);
      // }
  
      const profileData = {
        address: updateUserDto.address,
        phone: updateUserDto.phone,
        ...(uploadResult ? { photo: uploadResult.url } : {}),
      };
  
      if (!existingProfile) {
        existingProfile = await this.prisma.profile.create({
          data: {
            address: profileData.address,
            phone: profileData.phone,
            photo: profileData.photo,
            userId: id
          },
        });
      } else {
        existingProfile = await this.prisma.profile.update({
          where: { userId: id },
          data: profileData,
        });
      }
  
      return existingProfile;
    } catch (error) {
      if (file) {
        await this.awsService.deleteFile(file.filename);
      }
  
      throw new CustomError(
        error?.message || 'Error al actualizar o crear el perfil.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async exportAllExcel(res: Response) {

    try {
      const users = await this.findAll();

      if (!Array.isArray(users) || users.length === 0) {
        const message = this.i18n.t('messages.usersNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      } 

      const columns: ExcelColumn[] = [
        { header: 'Nombre', key: 'name' },
        { header: 'Apellido', key: 'lastName' },
        { header: 'Email', key: 'email' },
        { header: 'Rol de Usuario', key: 'role' },
      ];
  
      const workbook = await this.excelService.generateExcel(
        users,
        columns,
        'Usuarios',
      );

      await this.excelService.exportToResponse(res, workbook, 'usuarios.xlsx');

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      const messageExportExcel = this.i18n.t('messages.messageExportExcel');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageExportExcel },
      });
   
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }

  }

  async uploadUsers(buffer: Buffer) {
    try {

      if (!buffer) {
        throw new CustomError(
          this.i18n.t('messages.fileNotProvided'),
          HttpStatus.BAD_REQUEST
        );
      }

      const users = await this.excelService.readExcel(buffer);

      if (!users || users.length === 0) {
        throw new CustomError(
          this.i18n.t('messages.emptyFile'),
          HttpStatus.BAD_REQUEST
        );
      }
  
      let createdCount = 0;
      let duplicatedCount = 0;
      let validationErrorsCount = 0;
  
      for (let index = 0; index < users.length; index++) {
        const element: CreateUserDto = users[index];
  
        const userDto = plainToInstance(CreateUserDto, element);
        const errors = await validate(userDto);
  
        if (errors.length > 0) {
          validationErrorsCount++;
          continue; 
        }
  
        if (element.email) {
          const userExists = await this.prisma.user.findFirst({
            where: {
              email: {
                equals: element.email,
                mode: 'insensitive',
              },
            },
          });
  
          if (!userExists) {
            await this.create(element);
            createdCount++; 
          } else {
            duplicatedCount++;
          }
        }
      }
  
      return {
        created: createdCount,
        duplicated: duplicatedCount,
        validationErrors: validationErrorsCount,
      };
  
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      const messageActionRegister = this.i18n.t('messages.messageActionRegister');
      const message = this.i18n.t('messages.genericError', {
        args: { action: messageActionRegister },
      });
  
      throw new CustomError(
        error?.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
}
