'use client'

import { useState, useEffect } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'
import { getApiClient } from '@/lib/api'
import type { Market, MarketPrice } from '@cme-trading/api-client'

type Category = 'GOODS' | 'CRYPTOCURRENCY' | 'MONEY'

interface MarketWithPrice extends Market {
  price?: number
  change24h?: number
  volume?: number
}

export default function MarketPage() {
  const [category, setCategory] = useState<Category>('CRYPTOCURRENCY')
  const [markets, setMarkets] = useState<MarketWithPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true)
      setIsError(false)
      
      try {
        const apiClient = getApiClient()
        const marketList = await apiClient.market.list(category)
        
        // Mock static prices for consistent display
        // TODO: Replace with real price API when available
        const mockPrices: Record<string, { price: number; change24h: number; volume: number }> = {
          'btc-usdt': { price: 42500.50, change24h: 3.02, volume: 15420000 },
          'eth-usdt': { price: 2250.75, change24h: -2.18, volume: 8500000 },
          'xau-usd': { price: 2035.20, change24h: 1.25, volume: 5420000 },
          'oil-usd': { price: 78.45, change24h: -0.85, volume: 3200000 },
          'eur-usd': { price: 1.0842, change24h: 0.15, volume: 12500000 },
          'gbp-usd': { price: 1.2635, change24h: -0.32, volume: 8900000 },
        }
        
        const marketsWithPrices: MarketWithPrice[] = marketList.map((market) => {
          const priceData = mockPrices[market.id] || { price: 100, change24h: 0, volume: 1000000 }
          return {
            ...market,
            ...priceData,
          }
        })
        
        setMarkets(marketsWithPrices)
      } catch (error) {
        console.error('Failed to fetch markets:', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkets()
  }, [category])

  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Market" />

      <main className="pt-16 max-w-md mx-auto">
        {/* Category Tabs */}
        <div className="flex bg-background-secondary border-b border-white/10 sticky top-16 z-30">
          {(['GOODS', 'CRYPTOCURRENCY', 'MONEY'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-4 text-sm font-medium transition ${
                category === cat
                  ? 'text-primary-main border-b-2 border-primary-main'
                  : 'text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market List */}
        <div className="px-4 py-4">
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background-secondary rounded-lg p-4 animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="h-6 w-24 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 w-16 bg-white/10 rounded"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 w-20 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 w-12 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isError && (
            <div className="bg-danger-main/10 border border-danger-main/20 rounded-lg p-4 text-center">
              <p className="text-danger-main">Không thể tải dữ liệu thị trường</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-primary-main hover:underline"
              >
                Thử lại
              </button>
            </div>
          )}
          
          {!isLoading && !isError && (
            <div className="space-y-2">
              {markets.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  Không có dữ liệu thị trường
                </div>
              ) : (
                markets.map((market) => (
                  <Link
                    key={market.id}
                    href={`/board?marketId=${market.id}`}
                    className="block bg-background-secondary rounded-lg p-4 hover:bg-background-tertiary transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-lg">{market.symbol}</div>
                        <div className="text-sm text-white/60">{market.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          ${market.price?.toLocaleString() || '0'}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            (market.change24h || 0) > 0
                              ? 'text-success-main'
                              : 'text-danger-main'
                          }`}
                        >
                          {(market.change24h || 0) > 0 ? '+' : ''}
                          {market.change24h || 0}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>24h Volume</span>
                      <span>${((market.volume || 0) / 1000000).toFixed(2)}M</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
