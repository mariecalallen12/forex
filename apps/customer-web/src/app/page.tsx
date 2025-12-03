import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-secondary/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CME Trading</div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-accent-main transition">Home</a>
            <a href="#features" className="hover:text-accent-main transition">Features</a>
            <a href="#about" className="hover:text-accent-main transition">About</a>
            <a href="#help" className="hover:text-accent-main transition">Help</a>
          </nav>
          <Link 
            href="/m"
            className="bg-accent-main text-black px-6 py-2 rounded-lg font-semibold hover:bg-accent-main/90 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Giao Dịch Chuyên Nghiệp
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            Nền tảng giao dịch hàng hóa, tiền điện tử và ngoại hối với công nghệ tiên tiến
          </p>
          <Link 
            href="/m"
            className="inline-block bg-accent-main text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-main/90 transition"
          >
            Bắt Đầu Ngay
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background-secondary">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Tính Năng Nổi Bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background-tertiary p-8 rounded-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-3">Giao Dịch Thời Gian Thực</h3>
              <p className="text-white/70">
                Cập nhật giá liên tục, đặt lệnh nhanh chóng với độ trễ thấp
              </p>
            </div>
            <div className="bg-background-tertiary p-8 rounded-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Bảo Mật Cao</h3>
              <p className="text-white/70">
                Mã hóa dữ liệu, xác thực 2 lớp, bảo vệ tài sản tối đa
              </p>
            </div>
            <div className="bg-background-tertiary p-8 rounded-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Lợi Nhuận Hấp Dẫn</h3>
              <p className="text-white/70">
                Tỷ lệ lợi nhuận cạnh tranh, nhiều sản phẩm giao dịch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Về Chúng Tôi</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            CME Trading là nền tảng giao dịch trực tuyến hàng đầu, 
            cung cấp dịch vụ giao dịch hàng hóa, tiền điện tử và ngoại hối 
            với công nghệ tiên tiến và bảo mật cao.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold mb-4">CME Trading</div>
          <p className="text-white/60 mb-6">
            Nền tảng giao dịch chuyên nghiệp
          </p>
          <div className="text-white/40 text-sm">
            © 2025 CME Trading. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
