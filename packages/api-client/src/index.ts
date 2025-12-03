import { ApiClient, ApiClientConfig } from './client'
import { AuthService } from './services/auth.service'
import { MarketService } from './services/market.service'
import { OrderService } from './services/order.service'
import { WalletService } from './services/wallet.service'
import { LeaderboardService } from './services/leaderboard.service'
import { ContentService } from './services/content.service'
import { AdminService } from './services/admin.service'

export * from './types'
export * from './client'
export * from './services/admin.service'

export class CMEApiClient {
  public auth: AuthService
  public market: MarketService
  public order: OrderService
  public wallet: WalletService
  public leaderboard: LeaderboardService
  public content: ContentService
  public admin: AdminService

  private client: ApiClient

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config)
    
    this.auth = new AuthService(this.client)
    this.market = new MarketService(this.client)
    this.order = new OrderService(this.client)
    this.wallet = new WalletService(this.client)
    this.leaderboard = new LeaderboardService(this.client)
    this.content = new ContentService(this.client)
    this.admin = new AdminService(this.client)
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

  // Expose raw HTTP methods for custom API calls
  async get<T>(url: string, config?: any): Promise<T> {
    return this.client.get<T>(url, config)
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post<T>(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    return this.client.delete<T>(url, config)
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
