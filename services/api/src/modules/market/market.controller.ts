import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketService } from './market.service';

@ApiTags('market')
@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get market list' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async getMarkets(
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.marketService.getMarkets(category, page, pageSize);
  }

  @Get('detail')
  @ApiOperation({ summary: 'Get market detail' })
  @ApiQuery({ name: 'id', required: true })
  async getMarketDetail(@Query('id') id: string) {
    return this.marketService.getMarketDetail(id);
  }
}
