import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface NotificationJob {
  userId: string;
  type: 'ORDER_SETTLED' | 'DEPOSIT' | 'WITHDRAWAL' | 'SYSTEM';
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  async sendNotification(notification: NotificationJob): Promise<void> {
    await this.notificationQueue.add('send', notification);
  }

  async sendBulkNotifications(notifications: NotificationJob[]): Promise<void> {
    const jobs = notifications.map(notif => ({
      name: 'send',
      data: notif,
    }));
    await this.notificationQueue.addBulk(jobs);
  }

  async getQueueStats() {
    const waiting = await this.notificationQueue.getWaitingCount();
    const active = await this.notificationQueue.getActiveCount();
    const completed = await this.notificationQueue.getCompletedCount();
    const failed = await this.notificationQueue.getFailedCount();

    return {
      waiting,
      active,
      completed,
      failed,
    };
  }
}
