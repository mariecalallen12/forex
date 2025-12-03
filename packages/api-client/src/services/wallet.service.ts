import { ApiClient } from '../client'
import { Wallet, WalletSummary } from '../types'

export class WalletService {
  constructor(private client: ApiClient) {}

  async getSummary(): Promise<WalletSummary> {
    return this.client.get<WalletSummary>('/api/wallet/summary')
  }

  async getHistory(params?: { page?: number; perPage?: number }): Promise<any> {
    return this.client.get('/api/wallet/history', { params })
  }

  async getWallets(): Promise<Wallet[]> {
    return this.client.get<Wallet[]>('/api/wallet')
  }
}
