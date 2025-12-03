import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceService],
    }).compile();

    service = module.get<PriceService>(PriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPriceList', () => {
    it('should return price list', async () => {
      const result = await service.getPriceList();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('items');
      expect(Array.isArray(result.data.items)).toBe(true);
    });

    it('should return prices with required fields', async () => {
      const result = await service.getPriceList();

      expect(result.data.items.length).toBeGreaterThan(0);
      
      const firstPrice = result.data.items[0];
      expect(firstPrice).toHaveProperty('marketId');
      expect(firstPrice).toHaveProperty('symbol');
      expect(firstPrice).toHaveProperty('price');
      expect(firstPrice).toHaveProperty('change24h');
      expect(firstPrice).toHaveProperty('changePercent24h');
      expect(firstPrice).toHaveProperty('volume24h');
      expect(firstPrice).toHaveProperty('high24h');
      expect(firstPrice).toHaveProperty('low24h');
      expect(firstPrice).toHaveProperty('timestamp');
    });

    it('should accept optional category parameter', async () => {
      const result = await service.getPriceList('crypto');

      expect(result.success).toBe(true);
      expect(result.data.items).toBeDefined();
    });

    it('should accept optional limit parameter', async () => {
      const result = await service.getPriceList(undefined, 5);

      expect(result.success).toBe(true);
      expect(result.data.items).toBeDefined();
    });

    it('should accept optional page parameter', async () => {
      const result = await service.getPriceList(undefined, 10, 2);

      expect(result.success).toBe(true);
      expect(result.data.items).toBeDefined();
    });
  });

  describe('getTicker', () => {
    it('should return ticker data for a market', async () => {
      const result = await service.getTicker('BTCUSDT');

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('symbol');
      expect(result.data).toHaveProperty('price');
      expect(result.data).toHaveProperty('change24h');
      expect(result.data).toHaveProperty('changePercent24h');
      expect(result.data).toHaveProperty('timestamp');
    });

    it('should return data with matching symbol', async () => {
      const market = 'ETHUSDT';
      const result = await service.getTicker(market);

      expect(result.data.symbol).toBe(market);
    });

    it('should return valid price data', async () => {
      const result = await service.getTicker('BTCUSDT');

      expect(typeof result.data.price).toBe('number');
      expect(result.data.price).toBeGreaterThan(0);
    });

    it('should return valid timestamp', async () => {
      const result = await service.getTicker('BTCUSDT');

      expect(result.data.timestamp).toBeInstanceOf(Date);
    });
  });
});
