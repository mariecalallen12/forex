import { ApiClient } from '../client'
import { Market, MarketPrice } from '../types'

export class MarketService {
  constructor(private client: ApiClient) {}

  async list(category?: string): Promise<Market[]> {
    const params = category ? { category } : {}
    return this.client.get<Market[]>('/api/market/list', { params })
  }

  async detail(id: string): Promise<Market> {
    return this.client.get<Market>(`/api/market/detail/${id}`)
  }

  async getPrices(symbols?: string[]): Promise<MarketPrice[]> {
    const params = symbols ? { symbols: symbols.join(',') } : {}
    return this.client.get<MarketPrice[]>('/api/price/list', { params })
  }

  async getTicker(symbol: string): Promise<MarketPrice> {
    return this.client.get<MarketPrice>(`/api/price/ticker/${symbol}`)
  }
}
