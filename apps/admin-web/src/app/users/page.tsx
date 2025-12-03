'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import UserTable from '@/components/users/UserTable'

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-sm text-gray-600">Danh sách tất cả người dùng trong hệ thống</p>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            + Thêm người dùng
          </button>
        </div>

        <UserTable />
      </div>
    </DashboardLayout>
  )
}
