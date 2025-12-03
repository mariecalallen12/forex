'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import OrderTable from '@/components/orders/OrderTable'

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-sm text-gray-600">Danh sách tất cả đơn hàng trong hệ thống</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Lọc
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Xuất Excel
            </button>
          </div>
        </div>

        <OrderTable />
      </div>
    </DashboardLayout>
  )
}
