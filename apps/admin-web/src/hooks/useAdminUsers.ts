'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'

export interface AdminUser {
  id: string
  email?: string
  phone?: string
  name?: string
  status: string
  balance: number
  totalOrders: number
  totalProfit: number
  createdAt: string
}

export function useAdminUsers() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin-users',
    async () => {
      // For now, return empty array - backend needs to implement this endpoint
      // In production: return apiClient.client.get<AdminUser[]>('/api/admin/users')
      return [] as AdminUser[]
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
    }
  )

  return {
    users: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
