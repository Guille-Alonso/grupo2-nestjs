import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PaginationModule } from 'src/utils/pagination/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
