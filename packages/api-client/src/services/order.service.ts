import { ApiClient } from '../client'
import { CreateOrderRequest, Order, PaginatedResponse } from '../types'

export interface OrderListParams {
  page?: number
  perPage?: number
  status?: string
}

export class OrderService {
  constructor(private client: ApiClient) {}

  async create(data: CreateOrderRequest): Promise<Order> {
    return this.client.post<Order>('/api/order', data)
  }

  async getById(id: string): Promise<Order> {
    return this.client.get<Order>(`/api/order/${id}`)
  }

  async list(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    return this.client.get<PaginatedResponse<Order>>('/api/order', { params })
  }

  async cancel(id: string): Promise<Order> {
    return this.client.post<Order>(`/api/order/${id}/cancel`)
  }
}
