import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderMatchingJob } from './order-matching.service';

@Processor('order-matching')
export class OrderMatchingProcessor {
  @Process('match-order')
  async handleOrderMatching(job: Job<OrderMatchingJob>) {
    const { orderId, userId, marketId, direction, amount, entryPrice, durationSec } = job.data;

    console.log(`Processing order ${orderId} for user ${userId}`);

    // Simulate price movement and settlement
    // In production, this would:
    // 1. Get current market price
    // 2. Calculate profit/loss
    // 3. Update user wallet
    // 4. Update order status
    // 5. Send notification

    try {
      // Mock settlement logic
      const exitPrice = entryPrice * (1 + (Math.random() - 0.5) * 0.02); // Random +/- 1%
      const isWin = (direction === 'UP' && exitPrice > entryPrice) || 
                    (direction === 'DOWN' && exitPrice < entryPrice);
      
      const pnl = isWin ? amount * 0.85 : -amount; // 85% payout on win

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
