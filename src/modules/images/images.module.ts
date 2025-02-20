import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';
import { AwsModule } from '../aws/aws.module';
@Module({
  imports: [PaginationModule, AwsModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
