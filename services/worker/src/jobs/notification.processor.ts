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
      // Mock notification sending
      await new Promise(resolve => setTimeout(resolve, 100));

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
