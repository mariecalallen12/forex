import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('price')
@Controller('api/price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get price list' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getPriceList(
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.priceService.getPriceList(category, limit, page);
  }

  @Get('ticker')
  @ApiOperation({ summary: 'Get ticker price' })
  @ApiQuery({ name: 'market', required: true })
  async getTicker(@Query('market') market: string) {
    return this.priceService.getTicker(market);
  }
}
