'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'
import type { WalletSummary } from '@cme-trading/api-client'

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
    summary: data as WalletSummary | undefined,
    wallets: data?.wallets || [],
    isLoading,
    isError: error,
    mutate,
  }
}
