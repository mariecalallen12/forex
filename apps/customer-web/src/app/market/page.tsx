'use client'

import { useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'

type Category = 'GOODS' | 'CRYPTOCURRENCY' | 'MONEY'

const mockMarkets = {
  GOODS: [
    { id: '1', symbol: 'XAU/USD', name: 'Gold', price: 2035.20, change24h: 1.25, volume: 5420000 },
    { id: '2', symbol: 'OIL/USD', name: 'Crude Oil', price: 78.45, change24h: -0.85, volume: 3200000 },
  ],
  CRYPTOCURRENCY: [
    { id: '3', symbol: 'BTC/USDT', name: 'Bitcoin', price: 42500.50, change24h: 3.02, volume: 15420000 },
    { id: '4', symbol: 'ETH/USDT', name: 'Ethereum', price: 2250.75, change24h: -2.18, volume: 8500000 },
  ],
  MONEY: [
    { id: '5', symbol: 'EUR/USD', name: 'Euro', price: 1.0842, change24h: 0.15, volume: 12500000 },
    { id: '6', symbol: 'GBP/USD', name: 'Pound', price: 1.2635, change24h: -0.32, volume: 8900000 },
  ],
}

export default function MarketPage() {
  const [category, setCategory] = useState<Category>('CRYPTOCURRENCY')

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
          <div className="space-y-2">
            {mockMarkets[category].map((market) => (
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
                      ${market.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        market.change24h > 0
                          ? 'text-success-main'
                          : 'text-danger-main'
                      }`}
                    >
                      {market.change24h > 0 ? '+' : ''}
                      {market.change24h}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>24h Volume</span>
                  <span>${(market.volume / 1000000).toFixed(2)}M</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
