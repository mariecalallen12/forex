import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;

  const mockOrder = {
    id: 'order123',
    userId: 'user123',
    marketId: 'BTC-USDT',
    direction: 'UP',
    amount: 100,
    durationSec: 60,
    status: 'NEW',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    const createOrderDto = {
      marketId: 'BTC-USDT',
      direction: 'UP' as const,
      amount: 100,
      durationSec: 60,
    };

    it('should create an order successfully', async () => {
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.createOrder('user123', createOrderDto);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('orderId');
      expect(result.data).toHaveProperty('status');
      expect(result.data.status).toBe('NEW');
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        userId: 'user123',
        marketId: 'BTC-USDT',
        direction: 'UP',
        amount: 100,
        durationSec: 60,
        status: 'NEW',
      });
    });

    it('should throw BadRequestException if amount is zero', async () => {
      await expect(
        service.createOrder('user123', { ...createOrderDto, amount: 0 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if amount is negative', async () => {
      await expect(
        service.createOrder('user123', { ...createOrderDto, amount: -10 })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrder', () => {
    it('should return an order by id', async () => {
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getOrder('order123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({ where: { id: 'order123' } });
    });

    it('should return null if order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      const result = await service.getOrder('nonexistent');

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('getUserOrders', () => {
    const mockOrders = [mockOrder, { ...mockOrder, id: 'order456' }];

    it('should return paginated user orders', async () => {
      mockOrderRepository.findAndCount.mockResolvedValue([mockOrders, 2]);

      const result = await service.getUserOrders('user123', 1, 20);

      expect(result.success).toBe(true);
      expect(result.data.items).toEqual(mockOrders);
      expect(result.data.total).toBe(2);
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(20);
      expect(result.data.totalPages).toBe(1);
    });

    it('should handle pagination correctly', async () => {
      const manyOrders = Array.from({ length: 25 }, (_, i) => ({
        ...mockOrder,
        id: `order${i}`,
      }));
      mockOrderRepository.findAndCount.mockResolvedValue([manyOrders.slice(0, 20), 25]);

      const result = await service.getUserOrders('user123', 1, 20);

      expect(result.data.totalPages).toBe(2);
      expect(mockOrderRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        skip: 0,
        take: 20,
        order: { createdAt: 'DESC' },
      });
    });

    it('should calculate pagination offset correctly for page 2', async () => {
      mockOrderRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getUserOrders('user123', 2, 20);

      expect(mockOrderRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        skip: 20,
        take: 20,
        order: { createdAt: 'DESC' },
      });
    });
  });
});
