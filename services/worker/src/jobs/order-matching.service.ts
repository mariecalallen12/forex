import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface OrderMatchingJob {
  orderId: string;
  userId: string;
  marketId: string;
  direction: 'UP' | 'DOWN';
  amount: number;
  entryPrice: number;
  durationSec: number;
}

@Injectable()
export class OrderMatchingService {
  constructor(
    @InjectQueue('order-matching') private orderMatchingQueue: Queue,
  ) {}

  async addOrderToQueue(job: OrderMatchingJob): Promise<void> {
    await this.orderMatchingQueue.add('match-order', job, {
      delay: job.durationSec * 1000, // Convert to milliseconds
    });
  }

  async getQueueStats() {
    const waiting = await this.orderMatchingQueue.getWaitingCount();
    const active = await this.orderMatchingQueue.getActiveCount();
    const completed = await this.orderMatchingQueue.getCompletedCount();
    const failed = await this.orderMatchingQueue.getFailedCount();

    return {
      waiting,
      active,
      completed,
      failed,
      total: waiting + active + completed + failed,
    };
  }
}
