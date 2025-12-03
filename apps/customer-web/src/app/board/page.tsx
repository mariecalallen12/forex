'use client'

import { useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'

const ORDER_DURATIONS = [
  { label: '1 phút', value: 60, profit: 5 },
  { label: '2 phút', value: 120, profit: 10 },
  { label: '3 phút', value: 180, profit: 15 },
  { label: '5 phút', value: 300, profit: 20 },
]

export default function TradingBoardPage() {
  const [amount, setAmount] = useState(100)
  const [duration, setDuration] = useState(60)

  const selectedDuration = ORDER_DURATIONS.find(d => d.value === duration)
  const expectedProfit = amount * (selectedDuration?.profit || 0) / 100

  const handleBuyUp = () => {
    console.log('Buy Up:', { amount, duration })
    alert('Lệnh Buy Up đã được đặt!')
  }

  const handleBuyDown = () => {
    console.log('Buy Down:', { amount, duration })
    alert('Lệnh Buy Down đã được đặt!')
  }

  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Trading Board" />

      <main className="pt-16 max-w-md mx-auto">
        {/* Chart Placeholder */}
        <div className="bg-background-secondary p-4 mx-4 mt-4 rounded-lg">
          <div className="h-64 flex items-center justify-center border border-white/10 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-white/60">Chart Area</div>
              <div className="text-sm text-white/40 mt-2">
                TradingView hoặc Chart Component
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-background-secondary p-4 mx-4 mt-4 rounded-lg">
          <h2 className="font-bold text-lg mb-4">Đặt lệnh</h2>

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
              className="bg-success-main hover:bg-success-main/90 text-white font-bold py-4 rounded-lg transition"
            >
              Buy Up 📈
            </button>
            <button
              onClick={handleBuyDown}
              className="bg-danger-main hover:bg-danger-main/90 text-white font-bold py-4 rounded-lg transition"
            >
              Buy Down 📉
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
