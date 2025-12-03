'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'
import type { DashboardStats } from '@cme-trading/api-client'

export function useDashboard() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'admin-dashboard',
    () => apiClient.admin.getDashboard(),
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
