'use client'

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            🔔 Notifications
          </button>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
