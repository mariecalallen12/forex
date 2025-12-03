'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'
import type { Order } from '@cme-trading/api-client'

export function useAdminOrders() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin-orders',
    () => apiClient.order.list(),
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    orders: (data || []) as Order[],
    isLoading,
    isError: error,
    mutate,
  }
}
