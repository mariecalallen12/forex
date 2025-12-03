'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'

const mockAuditLogs = [
  { id: '1', user: 'admin@cme.com', action: 'USER_CREATED', details: 'Created user: user1@example.com', timestamp: '2024-03-01 10:30:15', ip: '192.168.1.1' },
  { id: '2', user: 'admin@cme.com', action: 'ORDER_CANCELLED', details: 'Cancelled order: ORD-123', timestamp: '2024-03-01 11:15:30', ip: '192.168.1.1' },
  { id: '3', user: 'support@cme.com', action: 'USER_SUSPENDED', details: 'Suspended user: user2@example.com', timestamp: '2024-03-01 12:00:45', ip: '192.168.1.2' },
  { id: '4', user: 'admin@cme.com', action: 'CONTENT_UPDATED', details: 'Updated banner: ID-456', timestamp: '2024-03-01 13:45:20', ip: '192.168.1.1' },
]

export default function AuditPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-600">Theo dõi tất cả các hành động trong hệ thống</p>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hành động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Chi tiết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.details}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
