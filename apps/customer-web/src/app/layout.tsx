import type { Metadata } from 'next'
import '../styles/globals.css'

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
      <body className="font-sans">{children}</body>
    </html>
  )
}
