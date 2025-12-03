'use client'

import { useState } from 'react'

const mockOrders = [
  { id: 'ORD-001', user: 'user1@example.com', pair: 'BTC/USD', type: 'BUY_UP', amount: '$1,234.56', profit: '$234.56', status: 'completed', created: '2024-03-01 10:30' },
  { id: 'ORD-002', user: 'user2@example.com', pair: 'ETH/USD', type: 'BUY_DOWN', amount: '$567.89', profit: '-$67.89', status: 'completed', created: '2024-03-01 11:15' },
  { id: 'ORD-003', user: 'user3@example.com', pair: 'XAU/USD', type: 'BUY_UP', amount: '$890.12', profit: '$0.00', status: 'pending', created: '2024-03-01 12:00' },
  { id: 'ORD-004', user: 'user4@example.com', pair: 'EUR/USD', type: 'BUY_DOWN', amount: '$432.10', profit: '$43.21', status: 'completed', created: '2024-03-01 13:45' },
  { id: 'ORD-005', user: 'user5@example.com', pair: 'GBP/USD', type: 'BUY_UP', amount: '$765.43', profit: '$0.00', status: 'cancelled', created: '2024-03-01 14:20' },
]

export default function OrderTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pair.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, email, hoặc cặp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cặp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Lợi nhuận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {order.user}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {order.pair}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
                    order.type === 'BUY_UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.type}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.amount}
                </td>
                <td className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                  order.profit.startsWith('-') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {order.profit}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {order.created}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-900">Xem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
