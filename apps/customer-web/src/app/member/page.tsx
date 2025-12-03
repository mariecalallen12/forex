import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'

export default function AssetPage() {
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Asset" />

      <main className="pt-16 px-4 max-w-md mx-auto">
        {/* Asset Summary Card */}
        <div className="bg-gradient-to-br from-primary-main to-primary-dark rounded-xl p-6 mt-4 mb-6">
          <div className="text-white/80 text-sm mb-2">Tổng tài sản</div>
          <div className="text-4xl font-bold mb-4">$10,250.50</div>
          <div className="flex items-center space-x-2">
            <span className="text-success-main">+$450.25</span>
            <span className="text-white/60 text-sm">(+4.6% hôm nay)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Link
            href="/member/deposit"
            className="flex flex-col items-center p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition"
          >
            <span className="text-3xl mb-2">💳</span>
            <span className="text-xs">Deposit</span>
          </Link>
          <Link
            href="/member/withdraw"
            className="flex flex-col items-center p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition"
          >
            <span className="text-3xl mb-2">💰</span>
            <span className="text-xs">Withdraw</span>
          </Link>
          <Link
            href="/member/orders"
            className="flex flex-col items-center p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="text-xs">Orders</span>
          </Link>
          <Link
            href="/member/history"
            className="flex flex-col items-center p-4 bg-background-secondary rounded-lg hover:bg-background-tertiary transition"
          >
            <span className="text-3xl mb-2">📊</span>
            <span className="text-xs">History</span>
          </Link>
        </div>

        {/* Wallets */}
        <div className="bg-background-secondary rounded-xl p-4">
          <h2 className="font-bold text-lg mb-4">Ví của tôi</h2>
          <div className="space-y-3">
            {[
              { currency: 'USDT', balance: 8500.25, locked: 200.00 },
              { currency: 'BTC', balance: 0.05423, locked: 0.0 },
              { currency: 'ETH', balance: 0.8932, locked: 0.0 },
            ].map((wallet) => (
              <div
                key={wallet.currency}
                className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
              >
                <div>
                  <div className="font-semibold">{wallet.currency}</div>
                  <div className="text-sm text-white/60">
                    Available: {wallet.balance.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {wallet.balance.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                  </div>
                  {wallet.locked > 0 && (
                    <div className="text-xs text-white/40">
                      Locked: {wallet.locked.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
