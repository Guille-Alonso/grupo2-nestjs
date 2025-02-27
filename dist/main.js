"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./modules/app/app.module");
const logguer_interceptor_1 = require("./common/interceptors/logguer.interceptor");
const cors_config_1 = require("./config/cors.config");
const config_1 = require("@nestjs/config");
const nestjs_i18n_1 = require("nestjs-i18n");
const swagger_config_1 = require("./config/swagger.config");
const middlewares_1 = require("./common/middlewares");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(cors_config_1.corsOptions);
    app.setGlobalPrefix('api/v0');
    app.useGlobalPipes(new nestjs_i18n_1.I18nValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector), {
        excludePrefixes: ['password', 'createdAt', 'updatedAt', 'isDeleted', 'isActive'],
        ignoreDecorators: true,
    }));
    (0, swagger_config_1.setupSwagger)(app);
    const configService = app.get(config_1.ConfigService);
    const PORT = configService.get('PORT');
    const NODE_ENV = configService.get('NODE_ENV');
    app.useGlobalFilters(new middlewares_1.ValidationsErrorExceptionFilter());
    app.useGlobalInterceptors(new logguer_interceptor_1.LogguerInterceptor());
    await app.listen(PORT, () => {
        common_1.Logger.log(`Application running the port: http://localhost:${PORT}/api`, core_1.NestApplication.name);
        common_1.Logger.log(`Current environment: ${NODE_ENV}`, core_1.NestApplication.name);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map