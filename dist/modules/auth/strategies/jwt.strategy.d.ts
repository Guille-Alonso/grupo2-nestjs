import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interfaces';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(ConfigService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        role: string;
    }>;
}
export {};
