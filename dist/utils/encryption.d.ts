import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (providedPassword: string, hashedPassword: string) => Promise<boolean>;
export declare const createTokens: (payload: JwtPayload, jwtService: JwtService) => Promise<{
    accessToken: string;
}>;
