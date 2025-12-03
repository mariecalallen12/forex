# CME Trading Clone - Tài liệu kỹ thuật đầy đủ

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
4. [Cấu trúc dự án](#cấu-trúc-dự-án)
5. [Backend API](#backend-api)
6. [Customer Web](#customer-web)
7. [Admin Web](#admin-web)
8. [Database Schema](#database-schema)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)

## Giới thiệu

CME Trading Clone là hệ thống giao dịch trực tuyến được xây dựng để clone 1:1 từ https://cme-trading.online. Hệ thống bao gồm:

- **Customer Web**: Ứng dụng web cho khách hàng (Next.js 14)
- **Admin Web**: Ứng dụng quản trị (Next.js 14)
- **Backend API**: REST API server (NestJS)
- **Realtime Service**: WebSocket service cho cập nhật realtime
- **Worker Service**: Background jobs

## Kiến trúc hệ thống

### Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Customer Web (Next.js)  │  Admin Web (Next.js)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Backend                     │
├─────────────────────────────────────────────────────────────┤
│  NestJS REST API + WebSocket + Background Workers           │
│  - Auth    - User     - Wallet    - Market                  │
│  - Order   - Price    - Content   - Admin                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis  │  Message Queue  │  Object Storage │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- SWR / React Query

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- Redis
- JWT Authentication

**DevOps:**
- Docker
- pnpm (monorepo)
- GitHub Actions (CI/CD)

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Redis >= 6
- Git

### Bước 1: Clone repository

```bash
git clone https://github.com/mariecalallen12/forex.git
cd forex
```

### Bước 2: Cài đặt dependencies

```bash
pnpm install
```

### Bước 3: Thiết lập Database

#### Sử dụng Docker (Khuyến nghị)

```bash
# Tạo file docker-compose.yml (xem phần Docker setup)
docker-compose up -d postgres redis
```

#### Hoặc cài đặt thủ công

**PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-14

# macOS
brew install postgresql@14

# Tạo database
createdb cme_trading
```

**Redis:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Start Redis
redis-server
```

### Bước 4: Cấu hình môi trường

#### Backend API

```bash
cd services/api
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=cme_trading

JWT_SECRET=your-secure-secret-key-here
JWT_EXPIRES_IN=30m

REDIS_HOST=localhost
REDIS_PORT=6379

CORS_ORIGIN=http://localhost:3000
```

#### Customer Web

```bash
cd apps/customer-web
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Bước 5: Chạy migrations

```bash
cd services/api
pnpm run typeorm migration:run
```

### Bước 6: Khởi chạy services

#### Terminal 1: Backend API
```bash
pnpm dev:api
# API sẽ chạy tại http://localhost:3001
# API Docs tại http://localhost:3001/api/docs
```

#### Terminal 2: Customer Web
```bash
pnpm dev:customer
# App sẽ chạy tại http://localhost:3000
```

#### Terminal 3: Admin Web (khi đã có)
```bash
pnpm dev:admin
# Admin sẽ chạy tại http://localhost:3002
```

## Cấu trúc dự án

```
forex/
├── apps/
│   ├── customer-web/          # Next.js Customer App
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── styles/        # Global styles
│   │   ├── public/            # Static assets
│   │   └── package.json
│   │
│   └── admin-web/             # Next.js Admin App
│       └── (same structure)
│
├── services/
│   ├── api/                   # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/       # Feature modules
│   │   │   ├── common/        # Shared code
│   │   │   ├── config/        # Configuration
│   │   │   ├── main.ts        # Entry point
│   │   │   └── app.module.ts  # Root module
│   │   └── package.json
│   │
│   ├── realtime/              # WebSocket Service
│   └── worker/                # Background Jobs
│
├── packages/
│   ├── shared/                # Shared types & constants
│   ├── ui/                    # Shared UI components
│   ├── api-client/            # API client library
│   └── config/                # Shared config
│
├── infra/
│   ├── docker/                # Docker configs
│   └── k8s/                   # Kubernetes manifests
│
├── docs/                      # Documentation
├── migrations/                # Database migrations
├── scripts/                   # Utility scripts
└── tests/                     # Test suites
```

## Backend API

### Modules

#### Auth Module
- `POST /api/device/init` - Initialize device
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

#### Market Module
- `GET /api/market/list` - List markets
- `GET /api/market/detail` - Market detail

#### Price Module
- `GET /api/price/list` - Price list
- `GET /api/price/ticker` - Ticker price

#### Order Module
- `POST /api/order` - Create order
- `GET /api/order/:id` - Get order
- `GET /api/order` - List orders

#### Wallet Module
- `GET /api/wallet/summary` - Wallet summary
- `GET /api/wallet/history` - Transaction history

#### Leaderboard Module
- `GET /api/leaderboard` - Get leaderboard

#### Content Module
- `GET /api/content/banners` - Get banners
- `GET /api/content/help` - Help articles

### Authentication

API sử dụng JWT tokens:

```typescript
// Header
Authorization: Bearer <access_token>

// Token structure
{
  sub: "user_id",
  username: "username",
  iat: 1234567890,
  exp: 1234569890
}
```

### Error Handling

API trả về errors theo format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Customer Web

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login page |
| `/register` | Register page |
| `/m` | Mobile dashboard |
| `/market` | Market list |
| `/board` | Trading board |
| `/member` | Asset page |
| `/member/deposit` | Deposit page |
| `/member/withdraw` | Withdraw page |
| `/leaderboard` | Leaderboard |
| `/help` | Help center |

### Components

#### Layout Components
- `MobileHeader` - Header for mobile pages
- `BottomNav` - Bottom navigation bar

#### UI Components (sẽ thêm vào packages/ui)
- `Button` - Button component
- `Card` - Card component
- `Input` - Input component
- `Modal` - Modal component

### State Management

Sử dụng React hooks và Context API cho global state. Có thể nâng cấp lên Zustand hoặc Redux nếu cần.

### Data Fetching

Sử dụng SWR cho data fetching:

```typescript
import useSWR from 'swr'

function useMarkets() {
  const { data, error } = useSWR('/api/market/list', fetcher)
  return {
    markets: data?.data,
    isLoading: !error && !data,
    isError: error
  }
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR,
  phone VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  currency VARCHAR,
  balance DECIMAL(20,8),
  locked DECIMAL(20,8),
  UNIQUE(user_id, currency)
);
```

### Markets Table
```sql
CREATE TABLE markets (
  id UUID PRIMARY KEY,
  symbol VARCHAR,
  base_token_id UUID,
  quote_token_id UUID,
  category VARCHAR,
  tick_size DECIMAL(20,8),
  min_trade_size DECIMAL(20,8),
  status VARCHAR
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  market_id UUID REFERENCES markets(id),
  direction VARCHAR,
  amount DECIMAL(20,8),
  duration_sec INTEGER,
  status VARCHAR,
  result VARCHAR,
  payout_amount DECIMAL(20,8),
  entry_price DECIMAL(20,8),
  exit_price DECIMAL(20,8),
  created_at TIMESTAMP,
  settled_at TIMESTAMP
);
```

## Development Workflow

### Git Workflow

```bash
# Tạo feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push và tạo PR
git push origin feature/your-feature
```

### Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### Linting

```bash
# Lint all
pnpm lint

# Fix lint errors
pnpm lint:fix

# Type check
pnpm typecheck
```

### Building

```bash
# Build all
pnpm build

# Build specific app
pnpm build:customer
pnpm build:api
```

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure database backups
- [ ] Setup SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Configure logging
- [ ] Setup error tracking (Sentry)
- [ ] Run security audit
- [ ] Load testing
- [ ] Setup CI/CD pipeline

## Troubleshooting

### Common Issues

**Issue: pnpm install fails**
```bash
# Clear cache
pnpm store prune

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: Database connection fails**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d cme_trading
```

**Issue: Port already in use**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Support

- GitHub Issues: https://github.com/mariecalallen12/forex/issues
- Email: support@example.com
- Documentation: https://docs.example.com
