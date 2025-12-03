'use client'

import { useState } from 'react'

const mockUsers = [
  { id: '1', email: 'user1@example.com', name: 'Nguyễn Văn A', balance: '$1,234.56', status: 'active', created: '2024-01-15' },
  { id: '2', email: 'user2@example.com', name: 'Trần Thị B', balance: '$5,678.90', status: 'active', created: '2024-01-20' },
  { id: '3', email: 'user3@example.com', name: 'Lê Văn C', balance: '$890.12', status: 'suspended', created: '2024-02-01' },
  { id: '4', email: 'user4@example.com', name: 'Phạm Thị D', balance: '$3,456.78', status: 'active', created: '2024-02-10' },
  { id: '5', email: 'user5@example.com', name: 'Hoàng Văn E', balance: '$234.56', status: 'inactive', created: '2024-02-15' },
]

export default function UserTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = mockUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc tên..."
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Số dư
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.balance}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.created}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Xem</button>
                  <button className="text-yellow-600 hover:text-yellow-900 mr-3">Sửa</button>
                  <button className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
