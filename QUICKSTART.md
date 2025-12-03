# 🚀 Hướng dẫn khởi động nhanh CME Trading Clone

## Bắt đầu trong 5 phút

### 1. Cài đặt dependencies

```bash
# Yêu cầu: Node.js 18+, pnpm 8+
pnpm install
```

### 2. Khởi động Database với Docker

```bash
# Khởi động PostgreSQL và Redis
docker-compose up -d postgres redis

# Kiểm tra trạng thái
docker-compose ps
```

### 3. Cấu hình môi trường

```bash
# Backend API
cp services/api/.env.example services/api/.env

# Customer Web
cp apps/customer-web/.env.example apps/customer-web/.env.local
```

### 4. Chạy ứng dụng

```bash
# Terminal 1: Backend API
pnpm dev:api
# ✅ API chạy tại: http://localhost:3001
# ✅ API Docs tại: http://localhost:3001/api/docs

# Terminal 2: Customer Web
pnpm dev:customer
# ✅ Web chạy tại: http://localhost:3000
```

## 🎯 Các trang có thể truy cập

### Landing & Auth
- `http://localhost:3000` - Landing page
- `http://localhost:3000/login` - Đăng nhập

### Customer App
- `http://localhost:3000/m` - Dashboard
- `http://localhost:3000/market` - Danh sách thị trường
- `http://localhost:3000/board` - Bàn giao dịch
- `http://localhost:3000/member` - Quản lý tài sản
- `http://localhost:3000/leaderboard` - Bảng xếp hạng
- `http://localhost:3000/help` - Trung tâm trợ giúp

### API Endpoints
- `http://localhost:3001/api/docs` - Swagger Documentation
- `http://localhost:3001/api/device/init` - Device init
- `http://localhost:3001/api/auth/login` - Login endpoint

## 🧪 Test API nhanh

```bash
# Device Init
curl -X POST http://localhost:3001/api/device/init \
  -H "Content-Type: application/json" \
  -d '{}'

# Register (sau khi API đang chạy)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0976854137",
    "password": "Abcd@2024"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneOrEmail": "0976854137",
    "password": "Abcd@2024"
  }'
```

## 🛠️ Lệnh hữu ích

```bash
# Build tất cả
pnpm build

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Clean
pnpm clean

# Xem logs Docker
docker-compose logs -f postgres
docker-compose logs -f redis

# Stop services
docker-compose down
```

## ❓ Xử lý lỗi thường gặp

### Port đã được sử dụng
```bash
# Tìm và kill process
lsof -i :3001  # hoặc :3000
kill -9 <PID>
```

### Database connection error
```bash
# Kiểm tra Docker
docker-compose ps

# Restart services
docker-compose restart postgres
```

### pnpm install fails
```bash
# Clear cache và reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

## 📚 Tài liệu chi tiết

- [Tài liệu đầy đủ](./docs/DOCUMENTATION.md)
- [Báo cáo phân tích](./Phan_tich_va_bao_cao.md)
- [Báo cáo kỹ thuật](./cme_trading_clone_report_vi.md)
- [Thiết kế chi tiết](./design_full_report_vi.md)

## 🎨 Demo Features

### Đã hoàn thành ✅
- Landing page với dark theme
- Login/Register flow (UI)
- Mobile dashboard
- Market list với tabs (GOODS/CRYPTO/MONEY)
- Trading board với order form
- Asset management page
- Leaderboard
- Help center
- Bottom navigation

### Đang phát triển 🔄
- API integration với frontend
- Real-time price updates
- Chart integration (TradingView)
- Admin Web
- WebSocket service
- Background workers
