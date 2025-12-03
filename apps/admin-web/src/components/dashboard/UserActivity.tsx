'use client'

const mockActivities = [
  { id: '1', user: 'user@example.com', action: 'Đăng nhập', time: '2 phút trước', type: 'login' },
  { id: '2', user: 'john@example.com', action: 'Tạo đơn hàng', time: '5 phút trước', type: 'order' },
  { id: '3', user: 'jane@example.com', action: 'Nạp tiền', time: '8 phút trước', type: 'deposit' },
  { id: '4', user: 'bob@example.com', action: 'Rút tiền', time: '12 phút trước', type: 'withdraw' },
  { id: '5', user: 'alice@example.com', action: 'Cập nhật profile', time: '15 phút trước', type: 'update' },
  { id: '6', user: 'charlie@example.com', action: 'Đăng xuất', time: '18 phút trước', type: 'logout' },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'login': return '🔐'
    case 'logout': return '🚪'
    case 'order': return '📋'
    case 'deposit': return '💵'
    case 'withdraw': return '💸'
    case 'update': return '✏️'
    default: return '📌'
  }
}

export default function UserActivity() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động người dùng</h3>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-600">{activity.user}</p>
            </div>
            <div className="text-xs text-gray-500">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
