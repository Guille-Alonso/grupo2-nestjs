import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
import { comparePassword, hashPassword, createTokens } from 'src/utils/encryption';
import { MessagingService } from '../messanging/messanging.service';
import { messagingConfig } from 'src/common/constants';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RegisterUserDto } from './dto/register.dto';
import CustomError from 'src/utils/custom.error';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private messagingService: MessagingService,
    private readonly i18n: I18nService,
  ) {}
  
  async register(user: RegisterUserDto) {
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
        message: message,
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
        error.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async login(credentials: LoginAuthDto) {
    try {
      const { password } = credentials;

      const findUser = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: credentials.email,
            mode: 'insensitive',
          },
          isDeleted:false,
          isActive:true
        },
      });
      
      if (!findUser) {
        const message = this.i18n.t('messages.unauthorized');
        throw new CustomError(message,HttpStatus.UNAUTHORIZED);
      }
   
      const isCorrectPassword = await comparePassword(
        password,
        findUser.password,
      );

      if (!isCorrectPassword) {
        const message = this.i18n.t('messages.unauthorized');
        throw new CustomError(message,HttpStatus.UNAUTHORIZED);
      }

      const payload: JwtPayload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      };

      const token = await createTokens(payload, this.jwtService);

      return {
        user: findUser,
        token,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionLogin = this.i18n.t('messages.messageActionLogin');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionLogin },
      });
   
      throw new CustomError(
        error.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async recoveryPassword(recoverDto: RecoverPasswordDto) {
    try {

      const findUser = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: recoverDto.email,
            mode: 'insensitive',
          },
        },
      });
      

      if(!findUser){
        const message = this.i18n.t('messages.userNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }

      const payload: JwtPayload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      };
  
      const { accessToken } = await createTokens(payload, this.jwtService);

      if(!accessToken){
        const messageActionRecoveryPassword = this.i18n.t('messages.messageActionRecoveryPassword');
        const message = this.i18n.t('messages.genericError', {
          args: { action:messageActionRecoveryPassword },
        });
        throw new CustomError(
          message,
          HttpStatus.INTERNAL_SERVER_ERROR, // 500
        );
      }
  
      await this.messagingService.sendRecoveryPassword({
        from: messagingConfig.emailSender,
        to: findUser.email,
        url: `${messagingConfig.resetPasswordUrls.backoffice}/${accessToken}`,
      });

      const message = this.i18n.t('messages.sendEmailRecoveryPassword');
      return {
        message
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionRecoveryPassword = this.i18n.t('messages.messageActionRecoveryPassword');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionRecoveryPassword },
      });
   
      throw new CustomError(
        error.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }

  }

  async resetPassword(resetDto: ResetPasswordDto, id: string) {
    try {
      const { password, confirmPassword } = resetDto;

      if (password !== confirmPassword) {
        const message = this.i18n.t('messages.errorPassword');
        throw new CustomError(
          message,
          HttpStatus.BAD_REQUEST // 400
        );
      }      

      const findUser = await this.prisma.user.findUnique({ where: { id } });
  
      if(!findUser){
        const message = this.i18n.t('messages.userNotFound');
        throw new CustomError(
         message,
          HttpStatus.NOT_FOUND, // 404
        );
      }
  
      await this.prisma.user.update({
        where: { id },
        data: {
          password: await hashPassword(password),
        },
      });

      const message = this.i18n.t('messages.passwordUpdated');
      return { message};

    } catch (error) {
        if (error instanceof CustomError) {
        throw error;
      }
  
      const messageActionResetPassword = this.i18n.t('messages.messageActionResetPassword');
      const message = this.i18n.t('messages.genericError', {
        args: { action:messageActionResetPassword },
      });
   
      throw new CustomError(
        error.message || message,
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
   
  }

}