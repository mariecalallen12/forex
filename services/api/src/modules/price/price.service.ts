import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
  async getPriceList(category?: string, limit = 10, page = 1) {
    // Mock data - in production, this would fetch from a price feed service
    const mockPrices = [
      {
        marketId: '1',
        symbol: 'BTCUSDT',
        price: 42500.50,
        change24h: 1250.30,
        changePercent24h: 3.02,
        volume24h: 15420000,
        high24h: 43000,
        low24h: 41000,
        timestamp: new Date(),
      },
      {
        marketId: '2',
        symbol: 'ETHUSDT',
        price: 2250.75,
        change24h: -50.25,
        changePercent24h: -2.18,
        volume24h: 8500000,
        high24h: 2350,
        low24h: 2200,
        timestamp: new Date(),
      },
    ];

    return {
      success: true,
      data: {
        items: mockPrices,
      },
    };
  }

  async getTicker(market: string) {
    // Mock data
    return {
      success: true,
      data: {
        symbol: market,
        price: 42500.50,
        change24h: 1250.30,
        changePercent24h: 3.02,
        timestamp: new Date(),
      },
    };
  }
}
