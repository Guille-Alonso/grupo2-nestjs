import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/config/env-validation.config';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import I18nModuleConfig from 'src/config/i18n.config';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    I18nModuleConfig(),
    PrismaModule,
    ProductsModule,
    CartModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
