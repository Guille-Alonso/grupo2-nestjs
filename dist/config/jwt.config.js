"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const JwtModuleConfig = async () => {
    const options = {
        imports: [config_1.ConfigModule],
        useFactory: async (configService) => {
            return {
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN'),
                },
            };
        },
        inject: [config_1.ConfigService],
    };
    return jwt_1.JwtModule.registerAsync(options);
};
exports.default = JwtModuleConfig;
//# sourceMappingURL=jwt.config.js.map