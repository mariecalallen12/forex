import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'

const mockLeaderboard = [
  { rank: 1, username: 'trader_pro', profit: 15000, profitPercent: 45.5, trades: 120, winRate: 78.5 },
  { rank: 2, username: 'crypto_king', profit: 12500, profitPercent: 38.2, trades: 95, winRate: 75.2 },
  { rank: 3, username: 'forex_master', profit: 10200, profitPercent: 32.8, trades: 85, winRate: 72.1 },
  { rank: 4, username: 'gold_trader', profit: 8500, profitPercent: 28.5, trades: 78, winRate: 68.3 },
  { rank: 5, username: 'btc_whale', profit: 7200, profitPercent: 24.8, trades: 65, winRate: 65.4 },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Leaderboard" />

      <main className="pt-16 px-4 max-w-md mx-auto">
        <div className="mt-4 mb-4 text-center">
          <h1 className="text-2xl font-bold mb-2">🏆 Top Traders</h1>
          <p className="text-white/60 text-sm">Bảng xếp hạng trader xuất sắc</p>
        </div>

        <div className="space-y-3">
          {mockLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`bg-background-secondary rounded-xl p-4 ${
                entry.rank <= 3
                  ? 'border-2 border-accent-main'
                  : ''
              }`}
            >
              <div className="flex items-center mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                    entry.rank === 1
                      ? 'bg-yellow-500 text-black'
                      : entry.rank === 2
                      ? 'bg-gray-400 text-black'
                      : entry.rank === 3
                      ? 'bg-orange-600 text-white'
                      : 'bg-background-tertiary text-white'
                  }`}
                >
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{entry.username}</div>
                  <div className="text-sm text-white/60">{entry.trades} trades</div>
                </div>
                <div className="text-right">
                  <div className="text-success-main font-bold">
                    +${entry.profit.toLocaleString()}
                  </div>
                  <div className="text-sm text-success-main">
                    +{entry.profitPercent}%
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Win Rate: {entry.winRate}%</span>
                <span>
                  <div className="w-24 h-2 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success-main"
                      style={{ width: `${entry.winRate}%` }}
                    />
                  </div>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
