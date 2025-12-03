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
        
        // For now, use mock prices since we don't have real price data
        // In production, fetch prices for each market
        const marketsWithPrices: MarketWithPrice[] = marketList.map((market) => ({
          ...market,
          price: Math.random() * 1000 + 100,
          change24h: (Math.random() - 0.5) * 10,
          volume: Math.random() * 10000000,
        }))
        
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
                    href={`/board/${market.symbol}`}
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
