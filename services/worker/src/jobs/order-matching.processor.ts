import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderMatchingJob } from './order-matching.service';

// Configuration constants
const PAYOUT_RATE = 0.85; // 85% payout on win
const PRICE_VOLATILITY = 0.02; // +/- 2% price movement

@Processor('order-matching')
export class OrderMatchingProcessor {
  @Process('match-order')
  async handleOrderMatching(job: Job<OrderMatchingJob>) {
    const { orderId, userId, marketId, direction, amount, entryPrice, durationSec } = job.data;

    console.log(`Processing order ${orderId} for user ${userId}`);

    // Simulate price movement and settlement
    // In production, this would:
    // 1. Get current market price from external service
    // 2. Calculate profit/loss
    // 3. Update user wallet in database
    // 4. Update order status
    // 5. Send notification to user

    try {
      // Mock settlement logic - TODO: Replace with real price feed service
      const priceChange = (Math.random() - 0.5) * PRICE_VOLATILITY;
      const exitPrice = entryPrice * (1 + priceChange);
      const isWin = (direction === 'UP' && exitPrice > entryPrice) || 
                    (direction === 'DOWN' && exitPrice < entryPrice);
      
      const pnl = isWin ? amount * PAYOUT_RATE : -amount;

      console.log(`Order ${orderId} settled:`, {
        entryPrice,
        exitPrice,
        isWin,
        pnl,
      });

      return {
        orderId,
        status: 'SETTLED',
        exitPrice,
        pnl,
        settledAt: new Date(),
      };
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
      throw error;
    }
  }
}
