'use client'

import useSWR from 'swr'
import { getApiClient } from '@/lib/api'
import { CreateOrderRequest } from '@cme-trading/api-client'

export function useOrders() {
  const apiClient = getApiClient()
  
  const { data, error, isLoading, mutate } = useSWR(
    'orders',
    () => apiClient.order.list(),
    {
      revalidateOnFocus: false,
    }
  )

  const createOrder = async (orderData: CreateOrderRequest) => {
    const order = await apiClient.order.create(orderData)
    mutate() // Refresh the list
    return order
  }

  return {
    orders: data?.data || [],
    pagination: data ? {
      total: data.total,
      page: data.page,
      perPage: data.perPage,
      totalPages: data.totalPages,
    } : undefined,
    isLoading,
    isError: error,
    createOrder,
    mutate,
  }
}
