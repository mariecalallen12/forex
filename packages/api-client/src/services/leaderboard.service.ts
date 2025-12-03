import { ApiClient } from '../client'
import { LeaderboardEntry } from '../types'

export class LeaderboardService {
  constructor(private client: ApiClient) {}

  async getLeaderboard(params?: { limit?: number }): Promise<LeaderboardEntry[]> {
    return this.client.get<LeaderboardEntry[]>('/api/leaderboard', { params })
  }
}
