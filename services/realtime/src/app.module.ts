import { Module } from '@nestjs/common';
import { PriceModule } from './modules/price.module';

@Module({
  imports: [PriceModule],
})
export class AppModule {}
