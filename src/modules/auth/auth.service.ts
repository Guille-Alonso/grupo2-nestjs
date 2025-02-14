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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private messagingService: MessagingService,
  ) {}
  
  async register(user: RegisterUserDto) {
    try {
 
      if (!user.email || !user.password || !user.name || !user.lastName) {
        throw new CustomError('Todos los campos son obligatorios.', HttpStatus.BAD_REQUEST); // 400
      }
  
      const email = user.email.toLowerCase();
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        throw new CustomError('El email ya está registrado.', HttpStatus.CONFLICT); // 409
      }
      
      const hashedPassword = await hashPassword(user.password);
  
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
          to: user.email,
        });
      } catch (emailError) {
    
        throw new CustomError(
          'Hubo un error al intentar enviar el correo de registro. Usuario registrado correctamente.',
          HttpStatus.CREATED, // 201
        );
      }

      return {
        message: 'Registro exitoso.',
        userId: newUser.id,
      };
      
    } catch (error) {
    
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al registrar usuario. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async login(credentials: LoginAuthDto) {
    try {
      const { password } = credentials;
      const email = credentials.email.toLowerCase();

      const findUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw new CustomError('Credenciales invalidas.',HttpStatus.UNAUTHORIZED);
      }

      const isCorrectPassword = await comparePassword(
        password,
        findUser.password,
      );

      if (!isCorrectPassword) {
        throw new CustomError('Credenciales invalidas.',HttpStatus.UNAUTHORIZED);
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
  
      throw new CustomError(
        error.message || 'Error al iniciar sesión. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async recoveryPassword(recoverDto: RecoverPasswordDto) {
    try {
      const email = recoverDto.email.toLowerCase();

      const findUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if(!findUser){
        throw new CustomError(
          'Usuario no encontrado.',
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
        throw new CustomError(
          'Error al recuperar contraseña. Inténtelo más tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR, // 500
        );
      }
  
      await this.messagingService.sendRecoveryPassword({
        from: messagingConfig.emailSender,
        to: findUser.email,
        url: `${messagingConfig.resetPasswordUrls.backoffice}/${accessToken}`,
      });

      return {
        message: 'Se envio un correo con las instrucciones para recuperar la contraseña.',
      };

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al recuperar contraseña. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }

  }

  async resetPassword(resetDto: ResetPasswordDto, id: string) {
    try {
      const { password, confirmPassword } = resetDto;

      if (password !== confirmPassword) {
        throw new CustomError(
          'Las contraseñas no coinciden.',
          HttpStatus.BAD_REQUEST // 400
        );
      }      

      const findUser = await this.prisma.user.findUnique({ where: { id } });
  
      if(!findUser){
        throw new CustomError(
          'Usuario no encontrado.',
          HttpStatus.NOT_FOUND, // 404
        );
      }
  
      await this.prisma.user.update({
        where: { id },
        data: {
          password: await hashPassword(password),
        },
      });

      return { message: 'Contraseña actualizada correctamente' };

    } catch (error) {
        if (error instanceof CustomError) {
        throw error;
      }
  
      throw new CustomError(
        error.message || 'Error al actualizar contraseña. Inténtelo más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
   
  }

  // private async createTokens(payload: JwtPayload) {
  //   return {
  //     accessToken: await this.jwtService.signAsync(payload),
  //   };
  // }
}