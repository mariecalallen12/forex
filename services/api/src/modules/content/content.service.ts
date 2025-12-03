import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { HelpArticle } from './entities/help-article.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(HelpArticle)
    private helpArticleRepository: Repository<HelpArticle>,
  ) {}

  async getBanners() {
    const banners = await this.bannerRepository.find({
      where: { active: true },
      order: { priority: 'DESC' },
    });

    return {
      success: true,
      data: banners,
    };
  }

  async getHelpArticles() {
    const articles = await this.helpArticleRepository.find({
      where: { status: 'published' },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: articles,
    };
  }
}
