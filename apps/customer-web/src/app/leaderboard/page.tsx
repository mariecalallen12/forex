'use client'

import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import { useLeaderboard } from '@/hooks/useLeaderboard'

export default function LeaderboardPage() {
  const { leaderboard, isLoading, isError } = useLeaderboard()
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Leaderboard" />

      <main className="pt-16 px-4 max-w-md mx-auto">
        <div className="mt-4 mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">🏆 Top Traders</h1>
          <p className="text-white/60 text-sm">Bảng xếp hạng trader xuất sắc</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-background-secondary rounded-xl p-4 animate-pulse">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 mr-3"></div>
                  <div className="flex-1">
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
        ) : isError ? (
          <div className="bg-danger-main/10 border border-danger-main/20 rounded-lg p-4 text-center">
            <p className="text-danger-main">Không thể tải bảng xếp hạng</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-primary-main hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            Chưa có dữ liệu bảng xếp hạng
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry: any, index: number) => {
              const rank = index + 1
              return (
                <div
                  key={entry.id || rank}
                  className={`bg-background-secondary rounded-xl p-4 ${
                    rank <= 3
                      ? 'border-2 border-accent-main'
                      : ''
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                        rank === 1
                          ? 'bg-yellow-500 text-black'
                          : rank === 2
                          ? 'bg-gray-400 text-black'
                          : rank === 3
                          ? 'bg-orange-600 text-white'
                          : 'bg-background-tertiary text-white'
                      }`}
                    >
                      {rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{entry.username || 'Unknown'}</div>
                      <div className="text-sm text-white/60">{entry.trades || 0} trades</div>
                    </div>
                    <div className="text-right">
                      <div className="text-success-main font-bold">
                        +${(entry.profit || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-success-main">
                        +{(entry.profitPercent || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Win Rate: {(entry.winRate || 0).toFixed(1)}%</span>
                    <span>
                      <div className="w-24 h-2 bg-background-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success-main"
                          style={{ width: `${entry.winRate || 0}%` }}
                        />
                      </div>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
