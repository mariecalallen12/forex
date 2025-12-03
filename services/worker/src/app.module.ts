import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderMatchingModule } from './jobs/order-matching.module';
import { NotificationModule } from './jobs/notification.module';
import { ScheduledTasksModule } from './jobs/scheduled-tasks.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    ScheduleModule.forRoot(),
    OrderMatchingModule,
    NotificationModule,
    ScheduledTasksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
