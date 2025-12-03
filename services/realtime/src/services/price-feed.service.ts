import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PriceGateway } from '../gateways/price.gateway';

interface MarketPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

@Injectable()
export class PriceFeedService implements OnModuleInit, OnModuleDestroy {
  private logger: Logger = new Logger('PriceFeedService');
  private priceIntervals: Map<string, NodeJS.Timeout> = new Map();
  private currentPrices: Map<string, MarketPrice> = new Map();

  // Initial prices for different markets
  private readonly initialPrices = {
    'btc-usdt': { symbol: 'BTC/USDT', price: 42500.50, baseVolume: 15420000 },
    'eth-usdt': { symbol: 'ETH/USDT', price: 2250.75, baseVolume: 8500000 },
    'xau-usd': { symbol: 'XAU/USD', price: 2035.20, baseVolume: 5420000 },
    'oil-usd': { symbol: 'OIL/USD', price: 78.45, baseVolume: 3200000 },
    'eur-usd': { symbol: 'EUR/USD', price: 1.0842, baseVolume: 12500000 },
    'gbp-usd': { symbol: 'GBP/USD', price: 1.2635, baseVolume: 8900000 },
  };

  constructor(private readonly priceGateway: PriceGateway) {}

  onModuleInit() {
    this.logger.log('Price Feed Service initialized');
    this.initializePrices();
    this.startPriceUpdates();
  }

  onModuleDestroy() {
    this.logger.log('Price Feed Service destroyed');
    this.stopPriceUpdates();
  }

  private initializePrices() {
    Object.entries(this.initialPrices).forEach(([id, data]) => {
      this.currentPrices.set(id, {
        symbol: data.symbol,
        price: data.price,
        change24h: 0,
        changePercent24h: 0,
        high24h: data.price * 1.05,
        low24h: data.price * 0.95,
        volume24h: data.baseVolume,
      });
    });
  }

  private startPriceUpdates() {
    Object.keys(this.initialPrices).forEach((marketId) => {
      // Update prices every 2-5 seconds with random interval
      const interval = setInterval(() => {
        this.updateMarketPrice(marketId);
      }, 2000 + Math.random() * 3000);

      this.priceIntervals.set(marketId, interval);
    });

    this.logger.log(
      `Started price updates for ${this.priceIntervals.size} markets`,
    );
  }

  private stopPriceUpdates() {
    this.priceIntervals.forEach((interval) => clearInterval(interval));
    this.priceIntervals.clear();
    this.logger.log('Stopped all price updates');
  }

  private updateMarketPrice(marketId: string) {
    const current = this.currentPrices.get(marketId);
    if (!current) return;

    // Generate realistic price movement (±0.5%)
    const changePercent = (Math.random() - 0.5) * 1.0; // -0.5% to +0.5%
    const priceChange = current.price * (changePercent / 100);
    const newPrice = current.price + priceChange;

    // Update 24h high/low
    const high24h = Math.max(current.high24h, newPrice);
    const low24h = Math.min(current.low24h, newPrice);

    // Calculate 24h change (mock - in production this would be actual 24h data)
    const change24h = newPrice - this.initialPrices[marketId].price;
    const changePercent24h = (change24h / this.initialPrices[marketId].price) * 100;

    // Update volume
    const volume24h = current.volume24h + Math.random() * 100000;

    const updatedPrice: MarketPrice = {
      symbol: current.symbol,
      price: parseFloat(newPrice.toFixed(2)),
      change24h: parseFloat(change24h.toFixed(2)),
      changePercent24h: parseFloat(changePercent24h.toFixed(2)),
      high24h: parseFloat(high24h.toFixed(2)),
      low24h: parseFloat(low24h.toFixed(2)),
      volume24h: Math.floor(volume24h),
    };

    this.currentPrices.set(marketId, updatedPrice);

    // Broadcast the update via WebSocket
    this.priceGateway.broadcastPriceUpdate(marketId, updatedPrice);
  }

  // Public method to get current price
  getCurrentPrice(marketId: string): MarketPrice | undefined {
    return this.currentPrices.get(marketId);
  }

  // Public method to get all current prices
  getAllCurrentPrices(): Map<string, MarketPrice> {
    return new Map(this.currentPrices);
  }

  // Force a price update for a specific market
  forcePriceUpdate(marketId: string) {
    this.updateMarketPrice(marketId);
  }
}
