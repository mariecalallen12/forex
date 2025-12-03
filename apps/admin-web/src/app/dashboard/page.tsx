'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentOrders from '@/components/dashboard/RecentOrders'
import UserActivity from '@/components/dashboard/UserActivity'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Tổng quan hệ thống CME Trading</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Tổng người dùng"
                value={stats?.totalUsers?.toString() || '0'}
                change={stats?.activeUsers ? `${stats.activeUsers} active` : 'N/A'}
                trend="up"
                icon="👥"
              />
              <StatsCard
                title="Đơn hàng hôm nay"
                value={stats?.ordersToday?.toString() || '0'}
                change={stats?.totalOrders ? `${stats.totalOrders} total` : 'N/A'}
                trend="up"
                icon="📋"
              />
              <StatsCard
                title="Tổng giao dịch"
                value={stats?.totalVolume ? `$${stats.totalVolume.toLocaleString()}` : '$0'}
                change={stats?.volumeChange ? `${stats.volumeChange > 0 ? '+' : ''}${stats.volumeChange.toFixed(1)}%` : 'N/A'}
                trend={stats?.volumeChange && stats.volumeChange > 0 ? 'up' : 'down'}
                icon="💰"
              />
              <StatsCard
                title="Lợi nhuận"
                value={stats?.totalProfit ? `$${stats.totalProfit.toLocaleString()}` : '$0'}
                change={stats?.profitChange ? `${stats.profitChange > 0 ? '+' : ''}${stats.profitChange.toFixed(1)}%` : 'N/A'}
                trend={stats?.profitChange && stats.profitChange > 0 ? 'up' : 'down'}
                icon="📈"
              />
            </>
          )}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentOrders />
          <UserActivity />
        </div>
      </div>
    </DashboardLayout>
  )
}
