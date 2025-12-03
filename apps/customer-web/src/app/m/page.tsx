import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'

const features = [
  { icon: '📚', label: 'Study', href: '/study' },
  { icon: '❓', label: 'Help Center', href: '/help' },
  { icon: '👥', label: 'Invite Friends', href: '/invite' },
  { icon: '💰', label: 'Savings', href: '/saving' },
  { icon: '⭐', label: 'VIP', href: '/vip' },
  { icon: '🤖', label: 'Trading Robot', href: '/robot' },
  { icon: '🏆', label: 'Leaderboard', href: '/leaderboard' },
  { icon: '⛏️', label: 'Mining', href: '/mining' },
]

export default function MobileDashboard() {
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Dashboard" />
      
      <main className="pt-16 px-4 max-w-md mx-auto">
        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
          <Link 
            href="/member/deposit"
            className="bg-gradient-to-br from-primary-main to-primary-dark p-6 rounded-xl flex flex-col items-center justify-center space-y-2 hover:scale-105 transition"
          >
            <span className="text-3xl">💳</span>
            <span className="font-semibold">Deposit</span>
          </Link>
          <Link 
            href="/cskh"
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl flex flex-col items-center justify-center space-y-2 hover:scale-105 transition"
          >
            <span className="text-3xl">💬</span>
            <span className="font-semibold">Customer Service</span>
          </Link>
        </div>

        {/* Top Markets */}
        <div className="bg-background-secondary rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Top Markets</h2>
          <div className="space-y-3">
            {[
              { symbol: 'BTC/USDT', price: '42,500.50', change: '+3.02%', positive: true },
              { symbol: 'ETH/USDT', price: '2,250.75', change: '-2.18%', positive: false },
              { symbol: 'XAU/USD', price: '2,035.20', change: '+1.25%', positive: true },
            ].map((market) => (
              <Link
                key={market.symbol}
                href="/market"
                className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg hover:bg-background-tertiary/80 transition"
              >
                <div>
                  <div className="font-semibold">{market.symbol}</div>
                  <div className="text-sm text-white/60">${market.price}</div>
                </div>
                <div className={`font-semibold ${market.positive ? 'text-success-main' : 'text-danger-main'}`}>
                  {market.change}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-background-secondary rounded-xl p-4">
          <h2 className="text-lg font-bold mb-4">Features</h2>
          <div className="grid grid-cols-4 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.label}
                href={feature.href}
                className="flex flex-col items-center space-y-2 hover:scale-110 transition"
              >
                <div className="text-3xl">{feature.icon}</div>
                <div className="text-xs text-center text-white/80">{feature.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
