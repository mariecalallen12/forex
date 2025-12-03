import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getSummary(userId: string) {
    const wallets = await this.walletRepository.find({ where: { userId } });
    
    const totalEquity = wallets.reduce((sum, w) => sum + w.balance, 0);
    
    return {
      success: true,
      data: {
        totalEquity,
        dailyPnl: 0,
        wallets: wallets.map(w => ({
          ...w,
          available: w.balance - w.locked,
        })),
      },
    };
  }

  async getHistory(userId: string) {
    return {
      success: true,
      data: {
        items: [],
        total: 0,
      },
    };
  }
}
