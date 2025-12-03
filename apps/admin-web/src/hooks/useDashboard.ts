'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'

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

export function useDashboard() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin-dashboard',
    async () => {
      // Use the admin dashboard endpoint
      const response = await apiClient.get<DashboardStats>('/api/admin/dashboard')
      return response
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  }
}
