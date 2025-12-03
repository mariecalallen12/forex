import { ApiClient } from '../client'

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  ordersToday: number
  totalVolume: number
  totalProfit: number
  volumeChange: number
  profitChange: number
}

export class AdminService {
  constructor(private client: ApiClient) {}

  async getDashboard(): Promise<DashboardStats> {
    return this.client.get<DashboardStats>('/api/admin/dashboard')
  }

  async getUsers(params?: { page?: number; perPage?: number }): Promise<any> {
    return this.client.get('/api/admin/users', { params })
  }

  async getUser(id: string): Promise<any> {
    return this.client.get(`/api/admin/users/${id}`)
  }

  async updateUser(id: string, data: any): Promise<any> {
    return this.client.put(`/api/admin/users/${id}`, data)
  }

  async deleteUser(id: string): Promise<void> {
    return this.client.delete(`/api/admin/users/${id}`)
  }
}
