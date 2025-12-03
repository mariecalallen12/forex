import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MarketService } from './market.service';
import { Market } from './entities/market.entity';

describe('MarketService', () => {
  let service: MarketService;
  let marketRepository: Repository<Market>;

  const mockMarket = {
    id: '1',
    symbol: 'BTC-USDT',
    name: 'Bitcoin',
    category: 'crypto',
    minAmount: 10,
    maxAmount: 10000,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockMarketRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketService,
        {
          provide: getRepositoryToken(Market),
          useValue: mockMarketRepository,
        },
      ],
    }).compile();

    service = module.get<MarketService>(MarketService);
    marketRepository = module.get<Repository<Market>>(getRepositoryToken(Market));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMarkets', () => {
    it('should return paginated markets without category filter', async () => {
      const mockMarkets = [mockMarket, { ...mockMarket, id: '2', symbol: 'ETH-USDT' }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockMarkets, 2]);

      const result = await service.getMarkets(undefined, 1, 20);

      expect(result.success).toBe(true);
      expect(result.data.items).toEqual(mockMarkets);
      expect(result.data.total).toBe(2);
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(20);
      expect(result.data.totalPages).toBe(1);
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });

    it('should filter markets by category', async () => {
      const mockMarkets = [mockMarket];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockMarkets, 1]);

      const result = await service.getMarkets('crypto', 1, 20);

      expect(result.success).toBe(true);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('market.category = :category', { category: 'crypto' });
    });

    it('should handle pagination correctly', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 50]);

      const result = await service.getMarkets(undefined, 2, 20);

      expect(result.data.totalPages).toBe(3);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should handle empty results', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.getMarkets();

      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(0);
      expect(result.data.total).toBe(0);
      expect(result.data.totalPages).toBe(0);
    });
  });

  describe('getMarketDetail', () => {
    it('should return market detail', async () => {
      mockMarketRepository.findOne.mockResolvedValue(mockMarket);

      const result = await service.getMarketDetail('1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMarket);
      expect(mockMarketRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if market not found', async () => {
      mockMarketRepository.findOne.mockResolvedValue(null);

      const result = await service.getMarketDetail('nonexistent');

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });
});
