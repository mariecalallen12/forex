import { Module } from '@nestjs/common';
import { OrderGateway } from '../gateways/order.gateway';

@Module({
  providers: [OrderGateway],
  exports: [OrderGateway],
})
export class OrderModule {}
