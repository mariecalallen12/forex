'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    // For now, redirect to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">CME Trading Admin</h1>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  )
}
