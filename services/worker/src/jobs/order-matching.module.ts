import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OrderMatchingProcessor } from './order-matching.processor';
import { OrderMatchingService } from './order-matching.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-matching',
    }),
  ],
  providers: [OrderMatchingProcessor, OrderMatchingService],
  exports: [OrderMatchingService],
})
export class OrderMatchingModule {}
