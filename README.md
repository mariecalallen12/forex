# CME Trading Clone - Hệ thống giao dịch trực tuyến

Dự án clone 1:1 từ https://cme-trading.online với đầy đủ chức năng Customer Web, Admin Web và Real-time WebSocket.

## 📊 Tiến độ dự án: ~83% hoàn thành

✅ Phase 0-6 hoàn thành (7/11) | 🔄 Phase 7-11 đang triển khai

## 📋 Mô tả dự án

Hệ thống giao dịch trực tuyến hoàn chỉnh bao gồm:
- **Customer Web**: Ứng dụng web cho khách hàng cuối (10 pages, mobile-first) ✅
- **Admin Web**: Ứng dụng quản trị nội bộ (6 pages) ✅
- **Backend API**: REST API với NestJS (11 modules, 30+ endpoints) ✅
- **API Client**: Typed API client library với 7 services ✅
- **Realtime Service**: WebSocket cho cập nhật thời gian thực (Port 3003) ✅ MỚI
- **Worker Service**: Xử lý background jobs ⏳

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Infrastructure**: Docker, pnpm workspaces
- **State**: SWR, Zustand
- **API**: Axios typed client

## 🚀 Bắt đầu nhanh

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Start database
docker compose up -d postgres redis

# 3. Chạy API backend (http://localhost:3001)
pnpm dev:api

# 4. Chạy Realtime WebSocket Service (http://localhost:3003) - MỚI
cd services/realtime && pnpm dev

# 5. Chạy Customer Web (http://localhost:3000)
pnpm dev:customer

# 6. Chạy Admin Web (http://localhost:3002)
pnpm dev:admin
```

## 📁 Cấu trúc dự án

```
forex/
├── apps/
│   ├── customer-web/     # ✅ 10 pages (với live prices)
│   └── admin-web/        # ✅ 6 pages
├── services/
│   ├── api/              # ✅ 11 modules REST API
│   └── realtime/         # ✅ WebSocket service (MỚI)
├── packages/
│   ├── shared/           # ✅ Types & constants
│   └── api-client/       # ✅ Typed API client (7 services)
├── docs/                 # ✅ Documentation
├── migrations/           # ✅ 15+ tables
└── docker-compose.yml    # ✅ PostgreSQL + Redis
```

## 🎯 Tính năng đã hoàn thành

### Customer Web (với API Integration & Live Prices)
- ✅ Landing page, Login/Register với authentication
- ✅ Mobile Dashboard với protected routes
- ✅ Market list với **live price updates** (WebSocket) 🆕
- ✅ Trading board với **real-time prices** & order API 🆕
- ✅ Asset management với wallet API
- ✅ Leaderboard với API, Help center

### Admin Web (với API Integration)
- ✅ Dashboard với real-time metrics từ API 🆕
- ✅ User management
- ✅ Order management với API 🆕
- ✅ Content management
- ✅ Audit logs
- ✅ System settings

### Realtime WebSocket Service 🆕
- ✅ Price Gateway (real-time price updates mỗi 2-5s)
- ✅ Order Gateway (order status notifications)
- ✅ 6 markets: BTC, ETH, XAU, OIL, EUR, GBP
- ✅ Mock price generator với ±0.5% volatility
- ✅ Socket.IO integration
- ✅ Auto-reconnection support

### Backend & API
- ✅ Authentication (JWT)
- ✅ 11 modules đầy đủ
- ✅ Swagger documentation
- ✅ Database schema (15+ tables)

## 📚 Tài liệu tham khảo

- [QUICKSTART.md](./QUICKSTART.md) - 5 phút khởi động
- [BAO_CAO_TIEN_DO.md](./BAO_CAO_TIEN_DO.md) - Báo cáo tiến độ chi tiết
- [DOCUMENTATION.md](./docs/DOCUMENTATION.md) - Tài liệu đầy đủ
- [Phân tích và báo cáo](./Phan_tich_va_bao_cao.md)

## 🔗 URLs

- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Realtime WebSocket**: ws://localhost:3003 🆕
  - Price namespace: ws://localhost:3003/price
  - Order namespace: ws://localhost:3003/orders
- **Customer Web**: http://localhost:3000
- **Admin Web**: http://localhost:3002

## 🆕 WebSocket Events

### Price Updates (namespace: `/price`)
```javascript
// Subscribe to markets
socket.emit('subscribe', { markets: ['btc-usdt', 'eth-usdt'] })

// Receive price updates
socket.on('priceUpdate', (data) => {
  // { marketId, symbol, price, change24h, changePercent24h, high24h, low24h, volume24h, timestamp }
})
```

### Order Updates (namespace: `/orders`)
```javascript
// Subscribe to user orders
socket.emit('subscribeUser', { userId: 'user-id' })

// Receive order updates
socket.on('orderUpdate', (data) => {
  // { orderId, userId, marketId, type, status, entryPrice, exitPrice, profit, timestamp }
})
```