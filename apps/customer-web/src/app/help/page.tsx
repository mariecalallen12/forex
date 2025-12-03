import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'

const helpCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    articles: [
      'Cách đăng ký tài khoản',
      'Hướng dẫn nạp tiền',
      'Hướng dẫn rút tiền',
    ],
  },
  {
    title: 'Trading Guide',
    icon: '📈',
    articles: [
      'Cách đặt lệnh Buy Up/Down',
      'Hiểu về thời gian và lợi nhuận',
      'Quản lý rủi ro khi giao dịch',
    ],
  },
  {
    title: 'Account & Security',
    icon: '🔒',
    articles: [
      'Bảo mật tài khoản',
      'Xác thực 2 lớp (2FA)',
      'Cách đổi mật khẩu',
    ],
  },
  {
    title: 'FAQ',
    icon: '❓',
    articles: [
      'Câu hỏi thường gặp',
      'Chính sách hoàn tiền',
      'Liên hệ hỗ trợ',
    ],
  },
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background-primary text-white pb-20">
      <MobileHeader title="Help Center" />

      <main className="pt-16 px-4 max-w-md mx-auto">
        <div className="mt-4 mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Trung tâm trợ giúp</h1>
          <p className="text-white/60 text-sm">
            Tìm câu trả lời cho câu hỏi của bạn
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Tìm kiếm bài viết..."
            className="w-full bg-background-secondary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-main transition"
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {helpCategories.map((category) => (
            <div
              key={category.title}
              className="bg-background-secondary rounded-xl p-4"
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h2 className="font-bold text-lg">{category.title}</h2>
              </div>
              <div className="space-y-2">
                {category.articles.map((article, index) => (
                  <Link
                    key={index}
                    href={`/help/${category.title.toLowerCase().replace(/\s+/g, '-')}/${index}`}
                    className="block p-3 bg-background-tertiary rounded-lg hover:bg-background-tertiary/80 transition text-sm"
                  >
                    {article}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-6 bg-gradient-to-br from-primary-main to-primary-dark rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-bold text-lg mb-2">Cần thêm hỗ trợ?</h3>
          <p className="text-white/80 text-sm mb-4">
            Liên hệ với đội ngũ hỗ trợ 24/7
          </p>
          <Link
            href="/cskh"
            className="inline-block bg-white text-primary-main font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
