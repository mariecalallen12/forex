import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationJob } from './notification.service';

@Processor('notifications')
export class NotificationProcessor {
  @Process('send')
  async handleNotification(job: Job<NotificationJob>) {
    const { userId, type, title, message, data } = job.data;

    console.log(`Sending ${type} notification to user ${userId}:`, title);

    // In production, this would:
    // 1. Send push notification
    // 2. Send email (if enabled)
    // 3. Store in notification table
    // 4. Send via WebSocket if user is online

    try {
      // Mock notification sending - TODO: Implement real notification service
      // In production, remove this delay or make it configurable
      const delay = parseInt(process.env.NOTIFICATION_DELAY || '0');
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log(`Notification sent successfully to user ${userId}`);

      return {
        userId,
        type,
        sentAt: new Date(),
        status: 'SENT',
      };
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error);
      throw error;
    }
  }
}
