import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger} from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { LogguerInterceptor } from './common/interceptors/logguer.interceptor';
import { corsOptions } from './config/cors.config';
import { ConfigService } from '@nestjs/config';
import { I18nValidationPipe } from 'nestjs-i18n';
import { setupSwagger } from './config/swagger.config';
import { ValidationsErrorExceptionFilter } from './common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  // app.enableCors({
  //   origin: 'http://localhost:5173', // no poner la barra al final
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true, 
  // });
  app.setGlobalPrefix('api/v0');
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),{
      excludePrefixes: ['password', 'createdAt', 'updatedAt', 'isDeleted', 'isActive'],
      ignoreDecorators: true,
    })
  )

  setupSwagger(app);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT');
  const NODE_ENV = configService.get<string>('NODE_ENV');

  app.useGlobalFilters(new ValidationsErrorExceptionFilter());
  app.useGlobalInterceptors(new LogguerInterceptor());
  
  await app.listen(PORT, () => {
    Logger.log(
      `Application running the port: http://localhost:${PORT}/api`,
      NestApplication.name,
    );
    Logger.log(`Current environment: ${NODE_ENV}`, NestApplication.name);
  });
}
bootstrap();