# CME Trading Clone - Hệ thống giao dịch trực tuyến

Dự án clone 1:1 từ https://cme-trading.online với đầy đủ chức năng Customer Web, Admin Web và Real-time WebSocket.

## 📊 Tiến độ dự án: ~92% hoàn thành

✅ Phase 0-6, 8, 11 hoàn thành (9/11) | 🔄 Phase 7, 9-10 đang triển khai

**🎉 Infrastructure Production-Ready!** Hệ thống đã sẵn sàng deploy lên Kubernetes với monitoring và auto-scaling.

## 📋 Mô tả dự án

Hệ thống giao dịch trực tuyến hoàn chỉnh bao gồm:
- **Customer Web**: Ứng dụng web cho khách hàng cuối (10 pages, mobile-first) ✅
- **Admin Web**: Ứng dụng quản trị nội bộ (6 pages) ✅
- **Backend API**: REST API với NestJS (11 modules, 30+ endpoints) ✅
- **API Client**: Typed API client library với 7 services ✅
- **Realtime Service**: WebSocket cho cập nhật thời gian thực (Port 3003) ✅ MỚI
- **Worker Service**: Xử lý background jobs ⏳

## 🛠 Tech Stack

### Application
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **State**: SWR, Zustand
- **API**: Axios typed client
- **Real-time**: Socket.IO WebSocket

### Infrastructure ✨ NEW
- **Containers**: Docker, Docker Compose
- **Orchestration**: Kubernetes (K8s manifests + Kustomize)
- **Monitoring**: Prometheus + Grafana
- **Load Balancing**: Nginx
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA)
- **CI/CD**: GitHub Actions

## 🚀 Bắt đầu nhanh

### Option 1: Development (Local)

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Start database
docker compose up -d postgres redis

# 3. Start all services
make dev

# Or start individually:
# make dev-api       # http://localhost:3001
# make dev-realtime  # http://localhost:3003
# make dev-customer  # http://localhost:3000
# make dev-admin     # http://localhost:3002
```

### Option 2: Docker Compose

```bash
# Development
docker compose up -d

# Production
docker compose -f docker-compose.prod.yml up -d
```

### Option 3: Kubernetes ✨ NEW

```bash
# Deploy to Kubernetes
make k8s-deploy

# Or manually:
./scripts/deploy-k8s.sh prod

# Check status
make k8s-status

# View logs
make k8s-logs-api
```

See [QUICKSTART.md](./QUICKSTART.md) and [docs/KUBERNETES.md](./docs/KUBERNETES.md) for more details.

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

### Infrastructure ✨ NEW - Production Ready!

#### Kubernetes Deployment
- ✅ **17 K8s manifests** (13 base + 4 overlays)
  - StatefulSets: PostgreSQL, Redis
  - Deployments: API, Realtime, Customer Web, Admin Web
  - Services, Ingress, ConfigMaps, Secrets
  - Horizontal Pod Autoscaler (HPA)
  - Kustomize for environment management
- ✅ **Auto-scaling**: 2-10 replicas based on CPU/Memory
- ✅ **Health checks**: Liveness & readiness probes
- ✅ **Resource limits**: CPU & memory constraints

#### Monitoring Stack
- ✅ **Prometheus**: Metrics collection (8 scrape jobs, 8 alert rules)
- ✅ **Grafana**: Pre-configured dashboards (System Overview)
- ✅ **Node Exporter**: System metrics collection
- ✅ **Alerts**: CPU, Memory, Service Down, Error Rate

#### Load Balancing
- ✅ **Nginx Load Balancer**: Advanced config
  - Rate limiting (100-200 req/s)
  - Gzip compression
  - WebSocket support
  - Session affinity
  - 4 upstream backends

#### CI/CD
- ✅ **GitHub Actions**: Automated workflows
  - CI: Lint, Build, Test, Security Scan
  - Deploy: Docker build & push, K8s deployment
- ✅ **Docker**: Multi-stage production builds
- ✅ **One-command deployment**: `make k8s-deploy`

## 📚 Tài liệu tham khảo

### Getting Started
- **[QUICKSTART.md](./QUICKSTART.md)** - 5 phút khởi động
- **[SUMMARY.md](./SUMMARY.md)** - Tóm tắt dự án hoàn chỉnh
- [BAO_CAO_TIEN_DO.md](./BAO_CAO_TIEN_DO.md) - Báo cáo tiến độ chi tiết

### Infrastructure & Deployment ✨ NEW
- **[docs/KUBERNETES.md](./docs/KUBERNETES.md)** - Complete K8s deployment guide
- **[docs/MONITORING.md](./docs/MONITORING.md)** - Monitoring & observability
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment
- **[infra/README.md](./infra/README.md)** - Infrastructure overview

### API & Development
- **[docs/API.md](./docs/API.md)** - API Reference đầy đủ
- [Phân tích và báo cáo](./Phan_tich_va_bao_cao.md) - Technical analysis

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