'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/m', label: 'Home', icon: '🏠' },
  { href: '/market', label: 'Market', icon: '📊' },
  { href: '/board', label: 'Trade', icon: '💹' },
  { href: '/member', label: 'Asset', icon: '👤' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-white/10 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 min-w-[80px] transition ${
                isActive
                  ? 'text-primary-main'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
