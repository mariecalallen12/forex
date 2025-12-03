import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import '../styles/globals.css'

const mulish = Mulish({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'CME Trading - Nền tảng giao dịch trực tuyến',
  description: 'Nền tảng giao dịch hàng hóa, tiền điện tử và ngoại hối',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark">
      <body className={mulish.className}>{children}</body>
    </html>
  )
}
