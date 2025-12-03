'use client'

const mockOrders = [
  { id: '1', user: 'user@example.com', pair: 'BTC/USD', amount: '$1,234', status: 'completed', time: '5 phút trước' },
  { id: '2', user: 'john@example.com', pair: 'ETH/USD', amount: '$567', status: 'pending', time: '10 phút trước' },
  { id: '3', user: 'jane@example.com', pair: 'XAU/USD', amount: '$890', status: 'completed', time: '15 phút trước' },
  { id: '4', user: 'bob@example.com', pair: 'EUR/USD', amount: '$432', status: 'failed', time: '20 phút trước' },
  { id: '5', user: 'alice@example.com', pair: 'GBP/USD', amount: '$765', status: 'completed', time: '25 phút trước' },
]

export default function RecentOrders() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Người dùng
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cặp
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Số tiền
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {order.user}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {order.pair}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  {order.amount}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
