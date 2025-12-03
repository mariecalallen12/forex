'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'

export function useMarkets(category?: string) {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    ['markets', category],
    () => apiClient.market.list(category),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  return {
    markets: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
