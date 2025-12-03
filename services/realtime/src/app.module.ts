import { Module } from '@nestjs/common';
import { PriceModule } from './modules/price.module';
import { OrderModule } from './modules/order.module';

@Module({
  imports: [PriceModule, OrderModule],
})
export class AppModule {}
