import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/config/env-validation.config';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    ProductsModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
