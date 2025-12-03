import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from './entities/market.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
  ) {}

  async getMarkets(category?: string, page = 1, pageSize = 20) {
    const query = this.marketRepository.createQueryBuilder('market');
    
    if (category) {
      query.where('market.category = :category', { category });
    }
    
    query.skip((page - 1) * pageSize).take(pageSize);
    
    const [items, total] = await query.getManyAndCount();
    
    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getMarketDetail(id: string) {
    const market = await this.marketRepository.findOne({ where: { id } });
    
    return {
      success: true,
      data: market,
    };
  }
}
