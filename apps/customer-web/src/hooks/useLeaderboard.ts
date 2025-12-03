'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'

export function useLeaderboard() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'leaderboard',
    () => apiClient.leaderboard.getLeaderboard(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  return {
    leaderboard: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
