"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_themes_1 = require("swagger-themes");
const setupSwagger = (app) => {
    const theme = new swagger_themes_1.SwaggerTheme();
    const darkStyle = theme.getBuffer(swagger_themes_1.SwaggerThemeNameEnum.DARK);
    const options = {
        customCss: darkStyle,
    };
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API NESTJS')
        .setDescription('Curso de nestjs, grupo 2')
        .setVersion('1.0')
        .addTag('Proyecto 1')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, options);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.config.js.map