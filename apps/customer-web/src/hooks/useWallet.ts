'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'

export function useWallet() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'wallet-summary',
    () => apiClient.wallet.getSummary(),
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    summary: data,
    isLoading,
    isError: error,
    mutate,
  }
}
