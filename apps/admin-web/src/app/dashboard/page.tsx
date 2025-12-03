'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentOrders from '@/components/dashboard/RecentOrders'
import UserActivity from '@/components/dashboard/UserActivity'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Tổng quan hệ thống CME Trading</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng người dùng"
            value="1,234"
            change="+12.5%"
            trend="up"
            icon="👥"
          />
          <StatsCard
            title="Đơn hàng hôm nay"
            value="567"
            change="+8.2%"
            trend="up"
            icon="📋"
          />
          <StatsCard
            title="Tổng giao dịch"
            value="$45,678"
            change="-3.4%"
            trend="down"
            icon="💰"
          />
          <StatsCard
            title="Lợi nhuận"
            value="$12,345"
            change="+15.8%"
            trend="up"
            icon="📈"
          />
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
