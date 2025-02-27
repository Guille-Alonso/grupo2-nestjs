import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RegisterUserDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    resetPassword(resetDto: ResetPasswordDto, req: any): Promise<{
        message: string;
    }>;
}
