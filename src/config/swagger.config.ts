import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export const setupSwagger = (app): void => {
  const config = new DocumentBuilder()
    .setTitle('API NESTJS')
    .setDescription('Curso de nestjs')
    .setVersion('1.0')
    .addTag('Proyecto 1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
