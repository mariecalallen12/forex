# CME Trading Clone - Hệ thống giao dịch trực tuyến

Dự án clone 1:1 từ https://cme-trading.online với đầy đủ chức năng Customer Web và Admin Web.

## 📊 Tiến độ dự án: ~55% hoàn thành

✅ Phase 0-4 hoàn thành | 🔄 Phase 5 đang triển khai | ⏳ Phase 6-10 chưa bắt đầu

## 📋 Mô tả dự án

Hệ thống giao dịch trực tuyến hoàn chỉnh bao gồm:
- **Customer Web**: Ứng dụng web cho khách hàng cuối (8 pages, mobile-first) ✅
- **Admin Web**: Ứng dụng quản trị nội bộ (6 pages) ✅ MỚI
- **Backend API**: REST API với NestJS (11 modules, 30+ endpoints) ✅
- **API Client**: Typed API client library với 6 services ✅ MỚI
- **Realtime Service**: WebSocket cho cập nhật thời gian thực ⏳
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

# 4. Chạy Customer Web (http://localhost:3000)
pnpm dev:customer

# 5. Chạy Admin Web (http://localhost:3002)
pnpm dev:admin
```

## 📁 Cấu trúc dự án

```
forex/
├── apps/
│   ├── customer-web/     # ✅ 8 pages
│   └── admin-web/        # ✅ 6 pages (MỚI)
├── services/
│   └── api/              # ✅ 11 modules
├── packages/
│   ├── shared/           # ✅ Types & constants
│   └── api-client/       # ✅ Typed API client (MỚI)
├── docs/                 # ✅ Documentation
├── migrations/           # ✅ 15+ tables
└── docker-compose.yml    # ✅ PostgreSQL + Redis
```

## 🎯 Tính năng đã hoàn thành

### Customer Web
- ✅ Landing page, Login/Register
- ✅ Mobile Dashboard
- ✅ Market list với category tabs
- ✅ Trading board với order form
- ✅ Asset management
- ✅ Leaderboard, Help center

### Admin Web (MỚI)
- ✅ Dashboard với metrics
- ✅ User management
- ✅ Order management
- ✅ Content management
- ✅ Audit logs
- ✅ System settings

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

- API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Customer Web: http://localhost:3000
- Admin Web: http://localhost:3002