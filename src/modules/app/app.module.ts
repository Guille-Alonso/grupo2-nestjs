import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD

@Module({
  imports: [],
=======
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/common/config/env-validation.config';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    PrismaModule
  ],
>>>>>>> origin/dev
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
