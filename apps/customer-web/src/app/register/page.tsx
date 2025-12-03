'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getApiClient } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      setIsLoading(true)
      const apiClient = getApiClient()
      await apiClient.auth.register({
        email: formData.email,
        name: formData.username,
        password: formData.password,
      })
      
      // After successful registration, redirect to login
      router.push('/login?registered=true')
    } catch (err: any) {
      console.error('Registration failed:', err)
      setError(
        err.response?.data?.message || 
        'Đăng ký thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">CME Trading</h1>
            <p className="text-white/60">Tạo tài khoản mới</p>
          </div>

          <div className="bg-background-secondary rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-danger-main/10 border border-danger-main/20 rounded-lg p-3 text-sm text-danger-main">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full bg-background-tertiary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-main text-black font-semibold py-3 rounded-lg hover:bg-accent-main/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-primary-main hover:text-primary-dark transition"
              >
                Đã có tài khoản? Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
