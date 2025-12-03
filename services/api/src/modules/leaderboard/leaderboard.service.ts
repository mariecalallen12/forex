import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardService {
  async getLeaderboard() {
    // Mock leaderboard data
    const mockData = [
      { rank: 1, userId: '1', username: 'trader_pro', profitAmount: 15000, profitPercent: 45.5, tradesCount: 120, winRate: 78.5 },
      { rank: 2, userId: '2', username: 'crypto_king', profitAmount: 12500, profitPercent: 38.2, tradesCount: 95, winRate: 75.2 },
      { rank: 3, userId: '3', username: 'forex_master', profitAmount: 10200, profitPercent: 32.8, tradesCount: 85, winRate: 72.1 },
    ];

    return {
      success: true,
      data: {
        items: mockData,
        asOf: new Date(),
      },
    };
  }
}
