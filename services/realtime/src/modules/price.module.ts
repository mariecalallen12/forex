import { Module } from '@nestjs/common';
import { PriceGateway } from '../gateways/price.gateway';
import { PriceFeedService } from '../services/price-feed.service';

@Module({
  providers: [PriceGateway, PriceFeedService],
  exports: [PriceGateway, PriceFeedService],
})
export class PriceModule {}
