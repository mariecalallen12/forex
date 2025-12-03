# Hướng dẫn Deployment - CME Trading Clone

## 📋 Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Development Environment](#development-environment)
3. [Production Build](#production-build)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Migration](#database-migration)
7. [Monitoring & Logs](#monitoring--logs)

---

## Yêu cầu hệ thống

### Minimum Requirements
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **PostgreSQL**: >= 14.0
- **Redis**: >= 7.0
- **RAM**: 4GB+
- **Disk**: 10GB+

### Recommended for Production
- **RAM**: 8GB+
- **CPU**: 4 cores+
- **Disk**: SSD 50GB+

---

## Development Environment

### 1. Clone và cài đặt

```bash
# Clone repository
git clone https://github.com/mariecalallen12/forex.git
cd forex

# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install
```

### 2. Setup Database

```bash
# Start PostgreSQL và Redis với Docker
docker compose up -d postgres redis

# Chờ services khởi động (30s)
sleep 30

# Run migrations
cd services/api
pnpm migration:run
```

### 3. Setup Environment Variables

Tạo file `.env` trong từng service:

**services/api/.env:**
```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=cme_trading

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

**services/realtime/.env:**
```env
NODE_ENV=development
PORT=3003
```

**apps/customer-web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3003
```

**apps/admin-web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3003
```

### 4. Khởi động services

```bash
# Terminal 1: API Backend
cd services/api
pnpm dev

# Terminal 2: Realtime WebSocket
cd services/realtime
pnpm dev

# Terminal 3: Customer Web
cd apps/customer-web
pnpm dev

# Terminal 4: Admin Web
cd apps/admin-web
pnpm dev
```

---

## Production Build

### 1. Build tất cả packages

```bash
# Build từ root directory
pnpm build

# Hoặc build từng package
pnpm build:api
pnpm build:customer
pnpm build:admin
```

### 2. Verify builds

```bash
# Check API build
ls -la services/api/dist/

# Check Realtime build
ls -la services/realtime/dist/

# Check Customer Web build
ls -la apps/customer-web/.next/

# Check Admin Web build
ls -la apps/admin-web/.next/
```

### 3. Start production servers

```bash
# API Backend
cd services/api
NODE_ENV=production node dist/main.js

# Realtime WebSocket
cd services/realtime
NODE_ENV=production node dist/main.js

# Customer Web
cd apps/customer-web
NODE_ENV=production pnpm start

# Admin Web
cd apps/admin-web
NODE_ENV=production pnpm start
```

---

## Docker Deployment

### 1. Build Docker images

```bash
# Build API image
docker build -t cme-api -f services/api/Dockerfile .

# Build Realtime image
docker build -t cme-realtime -f services/realtime/Dockerfile .

# Build Customer Web image
docker build -t cme-customer-web -f apps/customer-web/Dockerfile .

# Build Admin Web image
docker build -t cme-admin-web -f apps/admin-web/Dockerfile .
```

### 2. Docker Compose (Production)

Tạo file `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: cme_trading
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cme-network

  redis:
    image: redis:7-alpine
    networks:
      - cme-network

  api:
    image: cme-api
    environment:
      NODE_ENV: production
      DATABASE_HOST: postgres
      REDIS_HOST: redis
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    networks:
      - cme-network

  realtime:
    image: cme-realtime
    environment:
      NODE_ENV: production
    ports:
      - "3003:3003"
    networks:
      - cme-network

  customer-web:
    image: cme-customer-web
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://api:3001
      NEXT_PUBLIC_WS_URL: http://realtime:3003
    ports:
      - "3000:3000"
    depends_on:
      - api
      - realtime
    networks:
      - cme-network

  admin-web:
    image: cme-admin-web
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://api:3001
    ports:
      - "3002:3002"
    depends_on:
      - api
    networks:
      - cme-network

volumes:
  postgres_data:

networks:
  cme-network:
    driver: bridge
```

### 3. Deploy với Docker Compose

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop all services
docker compose -f docker-compose.prod.yml down
```

---

## Environment Variables

### Production Security Checklist

- [ ] Thay đổi `JWT_SECRET` và `JWT_REFRESH_SECRET`
- [ ] Sử dụng strong password cho PostgreSQL
- [ ] Cấu hình CORS chính xác
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Configure rate limiting
- [ ] Enable helmet security headers

### Required Variables

```bash
# API
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=<strong-secret-key>
CORS_ORIGIN=https://yourdomain.com

# Realtime
PORT=3003

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://ws.yourdomain.com
```

---

## Database Migration

### Development

```bash
# Tạo migration mới
cd services/api
pnpm migration:create MigrationName

# Run migrations
pnpm migration:run

# Revert migration
pnpm migration:revert
```

### Production

```bash
# Backup database trước khi migrate
pg_dump -h localhost -U postgres cme_trading > backup_$(date +%Y%m%d).sql

# Run migrations
cd services/api
NODE_ENV=production pnpm migration:run

# Verify
psql -h localhost -U postgres cme_trading -c "\dt"
```

---

## Monitoring & Logs

### Application Logs

```bash
# API logs
tail -f services/api/logs/application.log

# Realtime logs
tail -f services/realtime/logs/application.log

# Customer Web logs
tail -f apps/customer-web/.next/logs/

# Admin Web logs
tail -f apps/admin-web/.next/logs/
```

### Docker Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api

# Last 100 lines
docker compose logs --tail=100 api
```

### Health Checks

```bash
# API health
curl http://localhost:3001/health

# Realtime health
curl http://localhost:3003/health

# Customer Web
curl http://localhost:3000

# Admin Web
curl http://localhost:3002
```

---

## Performance Tuning

### Node.js Settings

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096"

# Enable production optimizations
NODE_ENV=production
```

### PostgreSQL

```sql
-- Optimize connections
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
SELECT pg_reload_conf();
```

### Redis

```bash
# Config in redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

---

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Find process using port
lsof -i :3001
kill -9 <PID>
```

2. **Database connection failed**
```bash
# Check PostgreSQL status
docker compose ps postgres
docker compose logs postgres
```

3. **WebSocket connection failed**
```bash
# Check Realtime service
curl http://localhost:3003
docker compose logs realtime
```

4. **Build failed**
```bash
# Clean và rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

---

## Support

- Documentation: [docs/](../docs/)
- Issues: GitHub Issues
- Progress Report: [BAO_CAO_TIEN_DO.md](../BAO_CAO_TIEN_DO.md)
