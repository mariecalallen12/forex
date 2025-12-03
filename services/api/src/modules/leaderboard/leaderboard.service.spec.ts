import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaderboardService],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard data', async () => {
      const result = await service.getLeaderboard();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('items');
      expect(result.data).toHaveProperty('asOf');
      expect(Array.isArray(result.data.items)).toBe(true);
    });

    it('should return items with required fields', async () => {
      const result = await service.getLeaderboard();

      expect(result.data.items.length).toBeGreaterThan(0);
      
      const firstItem = result.data.items[0];
      expect(firstItem).toHaveProperty('rank');
      expect(firstItem).toHaveProperty('userId');
      expect(firstItem).toHaveProperty('username');
      expect(firstItem).toHaveProperty('profitAmount');
      expect(firstItem).toHaveProperty('profitPercent');
      expect(firstItem).toHaveProperty('tradesCount');
      expect(firstItem).toHaveProperty('winRate');
    });

    it('should return items in descending order by rank', async () => {
      const result = await service.getLeaderboard();

      const items = result.data.items;
      for (let i = 1; i < items.length; i++) {
        expect(items[i].rank).toBeGreaterThan(items[i - 1].rank);
      }
    });

    it('should return valid timestamp', async () => {
      const result = await service.getLeaderboard();

      expect(result.data.asOf).toBeInstanceOf(Date);
    });
  });
});
