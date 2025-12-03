import { ApiClient } from '../client'
import { Banner, HelpArticle } from '../types'

export class ContentService {
  constructor(private client: ApiClient) {}

  async getBanners(): Promise<Banner[]> {
    return this.client.get<Banner[]>('/api/content/banners')
  }

  async getHelpArticles(category?: string): Promise<HelpArticle[]> {
    const params = category ? { category } : {}
    return this.client.get<HelpArticle[]>('/api/content/help', { params })
  }
}
