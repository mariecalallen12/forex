import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotificationService, NotificationJob } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockQueue: any;

  const mockNotification: NotificationJob = {
    userId: 'user123',
    type: 'ORDER_SETTLED',
    title: 'Order Completed',
    message: 'Your order has been settled',
    data: { orderId: 'order123' },
  };

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      addBulk: jest.fn(),
      getWaitingCount: jest.fn(),
      getActiveCount: jest.fn(),
      getCompletedCount: jest.fn(),
      getFailedCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getQueueToken('notifications'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should add notification to queue', async () => {
      mockQueue.add.mockResolvedValue({});

      await service.sendNotification(mockNotification);

      expect(mockQueue.add).toHaveBeenCalledWith('send', mockNotification);
    });

    it('should handle different notification types', async () => {
      const depositNotif = { ...mockNotification, type: 'DEPOSIT' as const };
      mockQueue.add.mockResolvedValue({});

      await service.sendNotification(depositNotif);

      expect(mockQueue.add).toHaveBeenCalledWith('send', depositNotif);
    });
  });

  describe('sendBulkNotifications', () => {
    it('should add multiple notifications to queue', async () => {
      const notifications = [
        mockNotification,
        { ...mockNotification, userId: 'user456' },
        { ...mockNotification, userId: 'user789' },
      ];
      mockQueue.addBulk.mockResolvedValue([]);

      await service.sendBulkNotifications(notifications);

      expect(mockQueue.addBulk).toHaveBeenCalledWith([
        { name: 'send', data: notifications[0] },
        { name: 'send', data: notifications[1] },
        { name: 'send', data: notifications[2] },
      ]);
    });

    it('should handle empty array', async () => {
      mockQueue.addBulk.mockResolvedValue([]);

      await service.sendBulkNotifications([]);

      expect(mockQueue.addBulk).toHaveBeenCalledWith([]);
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      mockQueue.getWaitingCount.mockResolvedValue(10);
      mockQueue.getActiveCount.mockResolvedValue(5);
      mockQueue.getCompletedCount.mockResolvedValue(200);
      mockQueue.getFailedCount.mockResolvedValue(3);

      const stats = await service.getQueueStats();

      expect(stats).toEqual({
        waiting: 10,
        active: 5,
        completed: 200,
        failed: 3,
      });
    });
  });
});
