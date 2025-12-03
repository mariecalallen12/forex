import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Banner } from './entities/banner.entity';
import { HelpArticle } from './entities/help-article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner, HelpArticle])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
