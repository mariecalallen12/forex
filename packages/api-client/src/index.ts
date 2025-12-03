import { ApiClient, ApiClientConfig } from './client'
import { AuthService } from './services/auth.service'
import { MarketService } from './services/market.service'
import { OrderService } from './services/order.service'
import { WalletService } from './services/wallet.service'
import { LeaderboardService } from './services/leaderboard.service'
import { ContentService } from './services/content.service'

export * from './types'
export * from './client'

export class CMEApiClient {
  public auth: AuthService
  public market: MarketService
  public order: OrderService
  public wallet: WalletService
  public leaderboard: LeaderboardService
  public content: ContentService

  private client: ApiClient

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config)
    
    this.auth = new AuthService(this.client)
    this.market = new MarketService(this.client)
    this.order = new OrderService(this.client)
    this.wallet = new WalletService(this.client)
    this.leaderboard = new LeaderboardService(this.client)
    this.content = new ContentService(this.client)
  }

  setToken(token: string) {
    this.client.setToken(token)
  }

  getToken(): string | null {
    return this.client.getToken()
  }

  clearToken() {
    this.client.clearToken()
  }
}

// Singleton instance
let apiClient: CMEApiClient | null = null

export function createApiClient(config: ApiClientConfig): CMEApiClient {
  apiClient = new CMEApiClient(config)
  return apiClient
}

export function getApiClient(): CMEApiClient {
  if (!apiClient) {
    throw new Error('API client not initialized. Call createApiClient first.')
  }
  return apiClient
}
