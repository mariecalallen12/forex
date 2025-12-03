# Báo cáo thiết kế kỹ thuật chi tiết — CME‑Trading (Bản tiếng Việt)

Phiên bản: 1.0
Ngày: 2025-12-03

Tác giả: Kiến trúc sư trưởng (do AI tạo để làm tài liệu kỹ thuật cho đội phát triển)

Mục tiêu: Tài liệu này cung cấp hướng dẫn toàn diện để phát triển một bản clone 1:1 của giao diện và chức năng chính của https://cme-trading.online, bao gồm hai ứng dụng con: Ứng dụng Web dành cho khách hàng (Customer Web) và Ứng dụng Web Admin (Admin Web). Tài liệu bao gồm kiến trúc hệ thống, cây thư mục monorepo, API contract, sơ đồ cơ sở dữ liệu, mô tả component frontend, CI/CD, bảo mật, kiểm thử và kế hoạch triển khai theo pha.

---

**Lưu ý về nguồn dữ liệu:** nhiều thông tin kỹ thuật được rút ra từ artefact chụp mạng và DOM có trong workspace (`captures/*`, `lighthouse_report.json`, `debug_responses.json`) — mọi inference được gắn chú thích "(inference)" khi không có bằng chứng trực tiếp.

**Phạm vi bắt buộc:** Hệ thống phải gồm hai ứng dụng con:
- `Customer Web`: cho người dùng đăng ký, đăng nhập, xem market, mở lệnh, quản lý tài sản.
- `Admin Web`: quản lý người dùng, giao dịch, lịch sử, cấu hình market, thumbnails, banner, và xử lý khiếu nại.

**Các giả định kỹ thuật chính:**
- Frontend: React + Next.js (TypeScript) với Tailwind CSS.
- Backend: Node.js (NestJS hoặc Express + TypeScript) với REST API; realtime service (WebSocket) nếu cần.
- DB: PostgreSQL cho dữ liệu chính, Redis cho cache và pub/sub (realtime), RabbitMQ hoặc Redis Streams cho job queue.
- Chart: tích hợp TradingView (nếu license có) hoặc `lightweight-charts` (OSS) + client-side feed.

---

**Mục lục**
- Executive summary
- System architecture (diagram & components)
- Repo directory tree (chi tiết)
- API specification (tóm tắt các endpoint quan trọng)
- Database schema (bảng chính + kiểu dữ liệu)
- Frontend components & pages (chi tiết props/state)
- Admin app features (pages, quyền)
- Realtime & Pricing feed options
- CI/CD, Docker & Infra sketch
- Security checklist
- Testing plan
- Implementation phases & estimates
- Appendix: evidence & curl samples

---

**Executive summary**
- Ứng dụng sẽ được triển khai dưới dạng monorepo chứa hai ứng dụng Next.js (customer + admin) và các packages chia sẻ.
- Giá trị cốt lõi cần tái tạo: trang dashboard mobile-first, bottom navigation, market list, chart container (embedded hoặc implement), trade form (Buy up/Buy down), asset page, deposit/withdraw flows, leaderboard, help center.
- Ưu tiên kỹ thuật: modular hóa, code-splitting, lazy-load chart bundle, SSR/ISR cho landing pages để cải thiện LCP.

---

**System architecture (tóm tắt)**

- Browser <-> CDN (static assets) + Frontend (Next.js)
- Frontend <-> API Gateway (REST) -> Auth Service, User Service, Trading Service, Market Service
- Trading Service <-> Realtime Service (WebSocket) hoặc tích hợp 3rd-party trading_view host
- Backend <-> PostgreSQL (primary), Redis (cache + session + pubsub), Message Queue (worker jobs)
- Admin Web <-> API Gateway (RBAC enforced)

Lý do: tách services giúp scale độc lập pricing/realtime, tách concerns (auth, market, orders).

---

**Repo directory tree (đề xuất cho monorepo)**

`/` (root)
- `apps/`
  - `customer/` — Next.js app cho khách hàng (landing, /m, /board, /market, /contract, /member)
  - `admin/` — Next.js app cho quản trị (dashboard, users, orders, settings)
- `packages/`
  - `ui/` — thành phần React chung (Button, Modal, NavBar, BottomNav, Card, Form controls)
  - `api-client/` — axios/fetch wrapper + typed API client (OpenAPI generated types)
  - `auth/` — shared auth helpers (JWT handling, cookie utilities)
  - `config/` — env schema, runtime config helpers
- `services/`
  - `api/` — backend REST monolith hoặc set of microservices (NestJS)
    - `src/modules/auth` — auth/login, profile, device/init
    - `src/modules/user` — user profile, KYC, balances
    - `src/modules/market` — markets, tokens, price endpoints
    - `src/modules/order` — orders, order matching (MVP: mock matcher)
    - `src/modules/admin` — admin endpoints
  - `realtime/` — ws-server or socket.io service (optional)
  - `worker/` — background jobs (settlement, reconcile, notifications)
- `infra/` — IaC templates (terraform/helm), k8s manifests, monitoring
- `migrations/` — SQL/knex/typeorm migration scripts
- `scripts/` — utilities (seed, local dev, db reset)
- `tests/` — e2e & integration tests harness (Playwright/Cypress)
- `docs/` — thêm spec, runbooks, onboarding

Ghi chú: mỗi app có `Dockerfile`, `package.json`, `tsconfig.json` riêng. `packages/*` là workspace packages (pnpm/yarn workspaces).

---

**API specification (tóm tắt các endpoint quan trọng)**

Ghi chú: các mẫu request/response dựa trên `captures/debug_responses.json`. Mọi dữ liệu PII đã được ẩn.

1) POST /api/device/init
- Mục đích: khởi tạo device, trả về metadata, `trading_view` URL, `top_coin`, `banners`, `languages`.
- Request: `{}` (body có thể rỗng hoặc gửi device info)
- Response: `{ success: boolean, data: { trading_view: string, top_coin: [...], banners: [...], languages: [...] } }`

2) POST /api/auth/login
- Mục đích: xác thực người dùng (phone/password hoặc email)
- Request: `{ phone?: string, email?: string, password: string }`
- Response: `{ success: true, data: { user: {...}, tokens: [...] }, token: "<jwt>" }` (inference)

3) GET /api/auth/profile
- Mục đích: trả profile người dùng
- Auth: Bearer token / cookie session

4) GET https://api.trading.ungdung79.com/api/price/list?limit=10&page=1
- Mục đích: price feed (thứ cấp) — có thể được gọi trực tiếp bởi frontend hoặc realtime service.

5) Orders
- POST /api/order/create -> tạo lệnh mua/ bán
- GET /api/order/:id -> trạng thái order
- GET /api/order/history -> lịch sử lệnh

Lưu ý: soạn OpenAPI/Swagger chi tiết cho các endpoint trên — giai đoạn đầu tạo stub mock server để dev frontend.

---

**Database schema (core tables, high-level)**

Phần này mô tả bảng chính; các field dùng kiểu dữ liệu PostgreSQL.

1) users
- id: bigserial PK
- username: varchar(64) UNIQUE
- phone: varchar(32) UNIQUE NULLABLE
- email: varchar(255) UNIQUE NULLABLE
- password_hash: varchar(255) NULLABLE (passwordless flows possible)
- role: varchar(32) (user/admin)
- status: smallint (0=inactive,1=active)
- created_at: timestamptz
- updated_at: timestamptz

2) wallets
- id: bigserial PK
- user_id: bigint FK -> users(id)
- currency: varchar(16) (USDT, BTC, ETH...)
- balance: numeric(24,8)
- locked: numeric(24,8)
- updated_at: timestamptz

3) tokens (token metadata)
- id: serial PK
- symbol: varchar(16)
- name: varchar(64)
- decimals: smallint

4) markets
- id: serial PK
- base: varchar(16)
- quote: varchar(16)
- symbol: varchar(32) UNIQUE (e.g., BTCUSDT)
- tick_size: numeric
- min_trade_size: numeric
- status: smallint

5) prices / price_ticks
- id: bigserial
- market_id: FK -> markets(id)
- price: numeric
- volume: numeric
- ts: timestamptz indexed

6) orders
- id: bigserial
- user_id: bigint
- market_id: bigint
- side: varchar(8) (buy/sell)
- type: varchar(16)
- amount: numeric
- price: numeric NULLABLE (market orders)
- status: varchar(32) (new, filled, canceled)
- created_at, updated_at

7) trades (executed fills)
- id, order_id, price, amount, ts

8) sessions / tokens
- id, user_id, token_hash, expires_at, created_at

9) audits / logs
- id, actor_id, action_type, resource, detail(jsonb), ts

Indexing: index trên (market_id, ts) cho price_ticks; unique index symbol trên markets.

---

**Frontend components & pages (chi tiết cho dev frontend)**

Mô tả các component chính với props/state tối thiểu để lập trình:

1) `Header` (props: {user?, onLogout})
- State: menuOpen
- Responsibilities: logo, links, user avatar, language selector, notifications badge.

2) `BottomNav` (props: {active})
- Buttons: Home, Market, Trade, Asset

3) `MarketList` (props: {markets: Market[], onSelect})
- State: sort, filter, search

4) `ChartWrapper` (props: {symbol, tradingViewUrl?})
- Behavior: lazy-load heavy chart bundle; if `tradingViewUrl` present embed via iframe or script (inference). Show placeholder skeleton for LCP.

5) `OrderForm` (props: {market, balance})
- State: amount, payoutPercent, time, validation, isSubmitting

6) `OrderBook` (props: {bids, asks})
- State: hover, selected price

7) `Auth/Login` (props: {onSuccess})
- Tabs: phone/email/username

8) `AssetPage` (props: {wallets})

9) `Admin/*` pages
- `UsersTable` (props: {filters, page})
- `OrdersTable`, `MarketsConfig`, `BannersManager`

Accessibility: tất cả nút phải có aria-label; forms có label; focus management khi modal mở.

---

**Admin app — chức năng chính**

- User management: list, suspend/activate, view KYC docs (if any)
- Orders: xem/forcibly settle/refund/manual adjust
- Markets: tạo/sửa symbol, status, tick/min size
- Banners & content: update hero images & texts (được trả về trong device/init)
- Audit logs & reports

RBAC: roles = superadmin, moderator, ops. Token-based auth + 2FA optional.

---

**Realtime & Pricing feed — options**

Option A (embed 3rd-party trading_view) — nhanh để đưa vào: sử dụng `trading_view` URL từ `device/init` và hiển thị iframe hoặc script embed. (Evidence: `device/init` trả `trading_view` = `https://trading.ungdung79.com`).

Ưu: nhanh, ít dev; Nhược: phụ thuộc bên thứ ba, khó custom.

Option B (own WS service + feed)
- Implement realtime ws server (socket.io / ws) -> publish price ticks from Price Service.
- Price Service có thể pull từ upstream (api.trading.ungdung79.com/api/price/list) hoặc từ feed provider.

Ưu: kiểm soát toàn bộ; Nhược: độ phức tạp cao hơn, cần infra.

Recommendation (MVP): triển khai Option A để sớm có UI 1:1, song song build mock WS/polling cho orderbook & market list để demo trade flows.

---

**CI/CD & Docker (high-level)**

CI: GitHub Actions
- jobs:
  - lint (pnpm install, pnpm lint)
  - test (unit)
  - build (apps/customer, apps/admin)
  - e2e (Playwright, run against staging)
  - publish (build docker images -> registry)

CD: deploy to k8s via image tag + helm upgrade
- Staging auto-deploy on branch `develop`.
- Production deploy requires manual approval and passing performance gate (Lighthouse threshold for landing page: LCP < 2.5s target; current was ~13.9s).

Dockerfile template (per app):
```
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

**Security checklist (must-have)**

- Secrets: all secret env vars stored in vault (not repo). Use `ENV` names in `.env.example`.
- Auth: JWT access + refresh rotation OR secure httpOnly cookie session.
- Passwords: bcrypt/argon2 hashing.
- Rate limiting: API gateway per IP & per account for sensitive endpoints.
- Input validation & sanitization (Zod/Joi).
- TLS everywhere; HSTS.
- Logging & monitoring: structured logs + Sentry + alerts on suspicious activity.
- RBAC and admin 2FA.
- PCI / KYC: if handling payments, follow local compliance.

Env vars (minimum):
- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SENTRY_DSN`, `SMTP_*`, `CLOUD_STORAGE_*`, `NODE_ENV`.

---

**Testing plan**

- Unit tests: components (React Testing Library), services, utils.
- Integration tests: API endpoints (supertest) against test DB.
- E2E: Playwright flows for login, view board, open order, asset page, admin user CRUD.
- Performance regression: Lighthouse CI for landing and board smoke tests.

Critical test cases:
- Login success/failure and token expiry.
- Create order -> order state transitions (new -> filled/canceled) via mock matcher.
- Price updates: front-end updates market list and orderbook via polling/WS.
- Admin: suspend user -> user cannot create orders.

---

**Implementation phases & estimates**

Team: 4 dev (2 frontend, 2 backend) + 1 designer + 1 QA (triage & e2e) — estimate cho MVP.

Phase 0 — Discovery & Design (1 week)
- Deliverable: design system, component list, API stub.

Phase 1 — Auth + Monorepo setup (1 week)
- Setup workspace, packages, auth endpoints (signup/login/profile), simple Next.js auth flow.

Phase 2 — Landing & Board Shell (2 weeks)
- Implement landing SSR, header/footer, bottom nav, market list skeleton, chart placeholder.

Phase 3 — Chart & Trade Form (2 weeks)
- Integrate trading_view embed (or lightweight-charts), order form UI, orderbook mock.

Phase 4 — Backend Order Flow & Mock Matcher (3 weeks)
- Implement orders endpoints, worker to settle demo trades, wallet bookkeeping (mock funds).

Phase 5 — Admin App + QA (2 weeks)
- Admin pages, RBAC, audit logs, user management.

Phase 6 — Hardening, Performance & Production readiness (2–3 weeks)
- CI/CD, infra, monitoring, Lighthouse improvements, security reviews.

Rough total MVP: 10–12 tuần (4 dev). Full product with real matching engine & compliance: +8–12 tuần.

---

**Appendix: evidence & quick curl**

Device init (mẫu):
```
curl -X POST "https://api.cmetradingvn.net/api/device/init" -H "Content-Type: application/json" -d '{}'
```

Login (mẫu):
```
curl -X POST "https://api.cmetradingvn.net/api/auth/login" -H "Content-Type: application/json" -d '{"phone":"REDACTED","password":"<hidden>"}'
```

Files tham khảo đã đọc trong workspace: `captures/debug_responses.json`, `captures/debug_requests.json`, `captures/network_requests.json`, `captures/lighthouse_report.json`, `cme_trading_clone_report_vi.md`, `Phan_tich_va_bao_cao.md`.

---

Nếu bạn đồng ý, bước tiếp theo tôi sẽ:
1) tạo scaffold monorepo (thư mục + README + package.json mẫu) và stub OpenAPI; hoặc
2) phân tích sâu `main.4c2c0360.js` để quyết định cách xử lý chart/realtime.

Hãy xác nhận chọn tiếp theo: (A) tạo scaffold code (Next.js skeleton cho Customer + Admin), (B) phân tích bundle JS sâu để xác nhận WebSocket/chart libs, hoặc (C) xuất báo cáo này ra PDF và đính kèm ảnh evidence.