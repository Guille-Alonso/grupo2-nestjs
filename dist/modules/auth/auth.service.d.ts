import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from '../messanging/messanging.service';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RegisterUserDto } from './dto/register.dto';
import { I18nService } from 'nestjs-i18n';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private messagingService;
    private readonly i18n;
    constructor(prisma: PrismaService, jwtService: JwtService, messagingService: MessagingService, i18n: I18nService);
    register(user: RegisterUserDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(credentials: LoginAuthDto): Promise<{
        user: {
            profile: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                isDeleted: boolean;
                userId: string;
                address: string;
                phone: string;
                photo: string;
            };
        } & {
            name: string;
            createdAt: Date;
            id: string;
            updatedAt: Date;
            isDeleted: boolean;
            email: string;
            password: string;
            isActive: boolean;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
        };
        token: {
            accessToken: string;
        };
    }>;
    recoveryPassword(recoverDto: RecoverPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetDto: ResetPasswordDto, id: string): Promise<{
        message: string;
    }>;
}
