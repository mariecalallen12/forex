'use client'

export default function MobileHeader({ title }: { title?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background-secondary/95 backdrop-blur-sm border-b border-white/10 z-40">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <div className="text-xl font-bold">{title || 'CME Trading'}</div>
        <div className="flex items-center space-x-3">
          <button className="text-xl">🔔</button>
          <button className="text-xl">🌐</button>
        </div>
      </div>
    </header>
  )
}
