'use client'

import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useWallet } from '@/hooks/useWallet'
import { useRouter } from 'next/navigation'

export default function AssetPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { summary, wallets, isLoading, isError } = useWallet()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Asset" />

      <main className="pt-16 px-4 max-w-md mx-auto">
        {/* Asset Summary Card */}
        <div className="bg-gradient-to-br from-primary-main to-primary-dark rounded-xl p-6 mt-4 mb-6">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-white/20 rounded mb-2"></div>
              <div className="h-10 w-32 bg-white/20 rounded mb-4"></div>
              <div className="h-4 w-40 bg-white/20 rounded"></div>
            </div>
          ) : isError ? (
            <div className="text-white/80 text-center">
              Không thể tải thông tin tài sản
            </div>
          ) : (
            <>
              <div className="text-white/80 text-sm mb-2">Tổng tài sản</div>
              <div className="text-4xl font-bold mb-4">
                ${summary?.totalBalance?.toFixed(2) || '0.00'}
              </div>
              <div className="flex items-center space-x-2">
                <span className={summary?.totalProfit && summary.totalProfit > 0 ? 'text-success-main' : 'text-danger-main'}>
                  {summary?.totalProfit && summary.totalProfit > 0 ? '+' : ''}
                  ${summary?.totalProfit?.toFixed(2) || '0.00'}
                </span>
                <span className="text-white/60 text-sm">
                  ({summary?.winRate?.toFixed(2) || '0'}% Win Rate)
                </span>
              </div>
            </>
          )}
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg animate-pulse">
                  <div className="h-10 w-20 bg-white/10 rounded"></div>
                  <div className="h-10 w-24 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-white/60">
              Không thể tải thông tin ví
            </div>
          ) : wallets && wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div
                  key={wallet.currency}
                  className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{wallet.currency}</div>
                    <div className="text-sm text-white/60">
                      Available: {wallet.balance?.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {wallet.balance?.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                    </div>
                    {wallet.frozenBalance && wallet.frozenBalance > 0 && (
                      <div className="text-xs text-white/40">
                        Frozen: {wallet.frozenBalance.toFixed(wallet.currency === 'USDT' ? 2 : 8)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-white/60">
              Chưa có ví nào
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
