'use client'

import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
}

export default function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={clsx(
            'text-sm font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {change}
        </span>
        <span className="ml-2 text-sm text-gray-600">so với tháng trước</span>
      </div>
    </div>
  )
}
