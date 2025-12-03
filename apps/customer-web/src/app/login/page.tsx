'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'phone' | 'email'>('phone')
  const [formData, setFormData] = useState({
    phoneOrEmail: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual login logic with API
    console.log('Login attempt:', formData)
    // Mock successful login
    router.push('/m')
  }

  return (
    <div className="min-h-screen bg-background-primary text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">CME Trading</h1>
            <p className="text-white/60">Đăng nhập vào tài khoản</p>
          </div>

          <div className="bg-background-secondary rounded-xl p-6">
            {/* Tab Selector */}
            <div className="flex mb-6 bg-background-tertiary rounded-lg p-1">
              <button
                onClick={() => setTab('phone')}
                className={`flex-1 py-2 rounded-md transition ${
                  tab === 'phone'
                    ? 'bg-primary-main text-white'
                    : 'text-white/60'
                }`}
              >
                Phone Number
              </button>
              <button
                onClick={() => setTab('email')}
                className={`flex-1 py-2 rounded-md transition ${
                  tab === 'email'
                    ? 'bg-primary-main text-white'
                    : 'text-white/60'
                }`}
              >
                Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tab === 'phone' ? 'Số điện thoại' : 'Email'}
                </label>
                <input
                  type={tab === 'phone' ? 'tel' : 'email'}
                  placeholder={tab === 'phone' ? '0976854137' : 'email@example.com'}
                  value={formData.phoneOrEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneOrEmail: e.target.value })
                  }
                  className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent-main text-black font-semibold py-3 rounded-lg hover:bg-accent-main/90 transition"
              >
                Đăng nhập
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/register"
                className="text-primary-main hover:text-primary-dark transition"
              >
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
