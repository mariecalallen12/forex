import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { OrderMatchingService, OrderMatchingJob } from './order-matching.service';

describe('OrderMatchingService', () => {
  let service: OrderMatchingService;
  let mockQueue: any;

  const mockJob: OrderMatchingJob = {
    orderId: 'order123',
    userId: 'user123',
    marketId: 'BTC-USDT',
    direction: 'UP',
    amount: 100,
    entryPrice: 42000,
    durationSec: 60,
  };

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      getWaitingCount: jest.fn(),
      getActiveCount: jest.fn(),
      getCompletedCount: jest.fn(),
      getFailedCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderMatchingService,
        {
          provide: getQueueToken('order-matching'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<OrderMatchingService>(OrderMatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addOrderToQueue', () => {
    it('should add order to queue with correct delay', async () => {
      mockQueue.add.mockResolvedValue({});

      await service.addOrderToQueue(mockJob);

      expect(mockQueue.add).toHaveBeenCalledWith('match-order', mockJob, {
        delay: 60000, // 60 seconds * 1000
      });
    });

    it('should handle different duration seconds', async () => {
      const job = { ...mockJob, durationSec: 120 };
      mockQueue.add.mockResolvedValue({});

      await service.addOrderToQueue(job);

      expect(mockQueue.add).toHaveBeenCalledWith('match-order', job, {
        delay: 120000,
      });
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      mockQueue.getWaitingCount.mockResolvedValue(5);
      mockQueue.getActiveCount.mockResolvedValue(3);
      mockQueue.getCompletedCount.mockResolvedValue(100);
      mockQueue.getFailedCount.mockResolvedValue(2);

      const stats = await service.getQueueStats();

      expect(stats).toEqual({
        waiting: 5,
        active: 3,
        completed: 100,
        failed: 2,
        total: 110,
      });
    });

    it('should handle zero counts', async () => {
      mockQueue.getWaitingCount.mockResolvedValue(0);
      mockQueue.getActiveCount.mockResolvedValue(0);
      mockQueue.getCompletedCount.mockResolvedValue(0);
      mockQueue.getFailedCount.mockResolvedValue(0);

      const stats = await service.getQueueStats();

      expect(stats.total).toBe(0);
    });
  });
});
