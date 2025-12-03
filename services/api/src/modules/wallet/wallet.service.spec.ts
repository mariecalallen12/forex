import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: Repository<Wallet>;

  const mockWallets = [
    {
      id: '1',
      userId: 'user123',
      currency: 'USDT',
      balance: 1000,
      locked: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user123',
      currency: 'BTC',
      balance: 0.5,
      locked: 0.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockWalletRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(getRepositoryToken(Wallet));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return wallet summary with total equity', async () => {
      mockWalletRepository.find.mockResolvedValue(mockWallets);

      const result = await service.getSummary('user123');

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('totalEquity');
      expect(result.data).toHaveProperty('dailyPnl');
      expect(result.data).toHaveProperty('wallets');
      expect(result.data.totalEquity).toBe(1000.5);
      expect(result.data.wallets).toHaveLength(2);
      expect(result.data.wallets[0]).toHaveProperty('available');
      expect(result.data.wallets[0].available).toBe(900);
    });

    it('should return zero equity for user with no wallets', async () => {
      mockWalletRepository.find.mockResolvedValue([]);

      const result = await service.getSummary('user456');

      expect(result.success).toBe(true);
      expect(result.data.totalEquity).toBe(0);
      expect(result.data.wallets).toHaveLength(0);
    });

    it('should calculate available balance correctly', async () => {
      mockWalletRepository.find.mockResolvedValue(mockWallets);

      const result = await service.getSummary('user123');

      expect(result.data.wallets[0].available).toBe(900); // 1000 - 100
      expect(result.data.wallets[1].available).toBe(0.4); // 0.5 - 0.1
    });
  });

  describe('getHistory', () => {
    it('should return empty history', async () => {
      const result = await service.getHistory('user123');

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('items');
      expect(result.data).toHaveProperty('total');
      expect(result.data.items).toHaveLength(0);
      expect(result.data.total).toBe(0);
    });
  });
});
