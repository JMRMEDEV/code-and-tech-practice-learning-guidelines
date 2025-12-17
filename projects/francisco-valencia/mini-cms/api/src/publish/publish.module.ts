import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { FileSystemService } from './services/filesystem.service';
import { PagesModule } from '../pages/pages.module';
import { SectionsModule } from '../sections/sections.module';

@Module({
  imports: [PagesModule, SectionsModule],
  controllers: [PublishController],
  providers: [PublishService, FileSystemService],
  exports: [PublishService],
})
export class PublishModule {}