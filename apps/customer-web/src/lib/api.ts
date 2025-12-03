import { createApiClient, CMEApiClient } from '@cme-trading/api-client'

let apiClient: CMEApiClient | null = null

export function getApiClient(): CMEApiClient {
  if (!apiClient) {
    apiClient = createApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    })
    
    // Restore token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cme_token')
      if (token) {
        apiClient.setToken(token)
      }
    }
  }
  
  return apiClient
}
