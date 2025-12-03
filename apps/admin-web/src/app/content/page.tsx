'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ContentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung</h1>
            <p className="text-sm text-gray-600">Quản lý banners và bài viết trợ giúp</p>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            + Thêm nội dung
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Banners</h3>
            <p className="text-sm text-gray-600 mb-4">Quản lý banners hiển thị trên trang chủ</p>
            <button className="text-blue-600 hover:text-blue-900">Xem tất cả →</button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bài viết trợ giúp</h3>
            <p className="text-sm text-gray-600 mb-4">Quản lý các bài viết hướng dẫn và FAQ</p>
            <button className="text-blue-600 hover:text-blue-900">Xem tất cả →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
