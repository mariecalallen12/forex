'use client'

import { useState, Suspense, useEffect } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { getApiClient } from '@/lib/api'
import { usePriceSocket } from '@/hooks/usePriceSocket'

const ORDER_DURATIONS = [
  { label: '1 phút', value: 60, profit: 5 },
  { label: '2 phút', value: 120, profit: 10 },
  { label: '3 phút', value: 180, profit: 15 },
  { label: '5 phút', value: 300, profit: 20 },
]

function TradingBoardContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const marketId = searchParams.get('marketId') || 'btc-usdt'
  
  const [amount, setAmount] = useState(100)
  const [duration, setDuration] = useState(60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [marketSymbol, setMarketSymbol] = useState('BTC/USDT')

  // Connect to live prices
  const { prices, isConnected } = usePriceSocket({
    markets: [marketId],
    enabled: true,
  })

  const currentPrice = prices.get(marketId)

  // Fetch market details
  useEffect(() => {
    const fetchMarketDetails = async () => {
      try {
        const apiClient = getApiClient()
        const market = await apiClient.market.detail(marketId)
        setMarketSymbol(market.symbol)
      } catch (error) {
        console.error('Failed to fetch market details:', error)
      }
    }
    fetchMarketDetails()
  }, [marketId])

  const selectedDuration = ORDER_DURATIONS.find(d => d.value === duration)
  const expectedProfit = amount * (selectedDuration?.profit || 0) / 100

  const handleOrder = async (type: 'BUY_UP' | 'BUY_DOWN') => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Validate amount
    if (amount < 10) {
      setError('Số tiền tối thiểu là $10')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const apiClient = getApiClient()
      await apiClient.order.create({
        marketId,
        type,
        amount,
        duration,
      })
      
      alert(`Lệnh ${type === 'BUY_UP' ? 'Buy Up' : 'Buy Down'} đã được đặt thành công!`)
      // Reset form
      setAmount(100)
    } catch (err: any) {
      console.error('Order failed:', err)
      setError(
        err.response?.data?.message || 
        'Đặt lệnh thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuyUp = () => handleOrder('BUY_UP')
  const handleBuyDown = () => handleOrder('BUY_DOWN')

  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Trading Board" />

      <main className="pt-16 max-w-md mx-auto">
        {/* Live Price Display */}
        <div className="bg-background-secondary p-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{marketSymbol}</h2>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success-main animate-pulse' : 'bg-white/30'}`}></div>
                <span className={isConnected ? 'text-success-main' : 'text-white/50'}>
                  {isConnected ? 'Live' : 'Connecting...'}
                </span>
              </div>
            </div>
            {currentPrice && (
              <div className="text-right">
                <div className="text-3xl font-bold">
                  ${currentPrice.price.toLocaleString()}
                </div>
                <div className={`text-sm font-medium ${
                  currentPrice.changePercent24h > 0 ? 'text-success-main' : 'text-danger-main'
                }`}>
                  {currentPrice.changePercent24h > 0 ? '+' : ''}
                  {currentPrice.changePercent24h.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
          
          {/* 24h Stats */}
          {currentPrice && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div>
                <div className="text-xs text-white/50">24h High</div>
                <div className="text-sm font-semibold">${currentPrice.high24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-white/50">24h Low</div>
                <div className="text-sm font-semibold">${currentPrice.low24h.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-white/50">Volume</div>
                <div className="text-sm font-semibold">${(currentPrice.volume24h / 1000000).toFixed(2)}M</div>
              </div>
            </div>
          )}
        </div>

        {/* Order Form */}
        <div className="bg-background-secondary p-4 mx-4 mt-4 rounded-lg">
          <h2 className="font-bold text-lg mb-4">Đặt lệnh</h2>

          {error && (
            <div className="mb-4 bg-danger-main/10 border border-danger-main/20 rounded-lg p-3 text-sm text-danger-main">
              {error}
            </div>
          )}

          {/* Duration Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Thời gian / Lợi nhuận
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-3 rounded-lg border transition ${
                    duration === d.value
                      ? 'bg-primary-main border-primary-main'
                      : 'bg-background-tertiary border-white/10'
                  }`}
                >
                  <div className="font-semibold">{d.label}</div>
                  <div className="text-sm text-success-main">+{d.profit}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Số tiền đầu tư
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="10"
              className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-white/60">Lợi nhuận dự kiến:</span>
              <span className="text-success-main font-semibold">
                +${expectedProfit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Buy Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBuyUp}
              disabled={isSubmitting}
              className="bg-success-main hover:bg-success-main/90 text-white font-bold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Buy Up 📈'}
            </button>
            <button
              onClick={handleBuyDown}
              disabled={isSubmitting}
              className="bg-danger-main hover:bg-danger-main/90 text-white font-bold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Buy Down 📉'}
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default function TradingBoardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-main border-r-transparent"></div>
          <p className="mt-2 text-sm text-white/60">Đang tải...</p>
        </div>
      </div>
    }>
      <TradingBoardContent />
    </Suspense>
  )
}
