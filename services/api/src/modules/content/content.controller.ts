import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('banners')
  @ApiOperation({ summary: 'Get banners' })
  async getBanners() {
    return this.contentService.getBanners();
  }

  @Get('help')
  @ApiOperation({ summary: 'Get help articles' })
  async getHelpArticles() {
    return this.contentService.getHelpArticles();
  }
}
