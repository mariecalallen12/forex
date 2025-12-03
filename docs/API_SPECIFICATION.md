# API Specification - CME Trading Clone

## Base URL
```
Development: http://localhost:3001
Production: https://api.cmetrading.example
```

## Authentication

API sử dụng JWT Bearer token authentication.

### Header Format
```
Authorization: Bearer <access_token>
```

### Token Lifecycle
- Access Token: 30 phút
- Refresh Token: 7 ngày

---

## Public Endpoints (No Auth Required)

### 1. Device Init
**Endpoint:** `POST /api/device/init`

**Description:** Khởi tạo device và lấy cấu hình app

**Request Body:**
```json
{
  "deviceId": "string (optional)",
  "locale": "vi | en (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tradingViewUrl": "https://trading.example.com",
    "banners": [],
    "languages": ["vi", "en"],
    "markets": [],
    "topCoins": []
  }
}
```

### 2. Register
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "phone": "0976854137 (optional)",
  "email": "user@example.com (optional)",
  "username": "username (optional)",
  "password": "Abcd@2024 (min 6 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "username",
      "phone": "0976854137",
      "email": "user@example.com",
      "status": "active",
      "createdAt": "2025-12-03T12:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "jwt_token",
      "expiresIn": 1800
    },
    "wallets": []
  }
}
```

### 3. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "phoneOrEmail": "0976854137 | user@example.com",
  "password": "Abcd@2024"
}
```

**Response:** Same as Register

---

## Protected Endpoints (Auth Required)

### Authentication

#### Get Profile
**Endpoint:** `GET /api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "username",
      "phone": "0976854137",
      "email": "user@example.com",
      "status": "active"
    }
  }
}
```

#### Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "jwt_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_jwt_token",
      "refreshToken": "new_jwt_token",
      "expiresIn": 1800
    }
  }
}
```

#### Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Market

#### List Markets
**Endpoint:** `GET /api/market/list`

**Query Parameters:**
- `category`: GOODS | CRYPTOCURRENCY | MONEY (optional)
- `page`: number (default: 1)
- `pageSize`: number (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "symbol": "BTCUSDT",
        "category": "CRYPTOCURRENCY",
        "tickSize": 0.01,
        "minTradeSize": 10,
        "status": "active"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

#### Market Detail
**Endpoint:** `GET /api/market/detail?id={marketId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "symbol": "BTCUSDT",
    "category": "CRYPTOCURRENCY",
    "tickSize": 0.01,
    "minTradeSize": 10,
    "status": "active"
  }
}
```

---

### Price

#### Price List
**Endpoint:** `GET /api/price/list`

**Query Parameters:**
- `category`: GOODS | CRYPTOCURRENCY | MONEY (optional)
- `limit`: number (default: 10)
- `page`: number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "marketId": "uuid",
        "symbol": "BTCUSDT",
        "price": 42500.50,
        "change24h": 1250.30,
        "changePercent24h": 3.02,
        "volume24h": 15420000,
        "high24h": 43000,
        "low24h": 41000,
        "timestamp": "2025-12-03T12:00:00Z"
      }
    ]
  }
}
```

#### Ticker Price
**Endpoint:** `GET /api/price/ticker?market={symbol}`

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "BTCUSDT",
    "price": 42500.50,
    "change24h": 1250.30,
    "changePercent24h": 3.02,
    "timestamp": "2025-12-03T12:00:00Z"
  }
}
```

---

### Order

#### Create Order
**Endpoint:** `POST /api/order`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "marketId": "uuid",
  "direction": "UP | DOWN",
  "amount": 100,
  "durationSec": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "NEW"
  }
}
```

#### Get Order
**Endpoint:** `GET /api/order/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "marketId": "uuid",
    "direction": "UP",
    "amount": 100,
    "durationSec": 60,
    "status": "SETTLED",
    "result": "WIN",
    "payoutAmount": 105,
    "entryPrice": 42500.50,
    "exitPrice": 42600.75,
    "createdAt": "2025-12-03T12:00:00Z",
    "settledAt": "2025-12-03T12:01:00Z"
  }
}
```

#### List User Orders
**Endpoint:** `GET /api/order`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `pageSize`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

---

### Wallet

#### Wallet Summary
**Endpoint:** `GET /api/wallet/summary`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEquity": 10250.50,
    "dailyPnl": 450.25,
    "wallets": [
      {
        "id": "uuid",
        "currency": "USDT",
        "balance": 8500.25,
        "locked": 200.00,
        "available": 8300.25
      }
    ]
  }
}
```

#### Transaction History
**Endpoint:** `GET /api/wallet/history`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0
  }
}
```

---

### Leaderboard

#### Get Leaderboard
**Endpoint:** `GET /api/leaderboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "rank": 1,
        "userId": "uuid",
        "username": "trader_pro",
        "profitAmount": 15000,
        "profitPercent": 45.5,
        "tradesCount": 120,
        "winRate": 78.5
      }
    ],
    "asOf": "2025-12-03T12:00:00Z"
  }
}
```

---

### Content

#### Get Banners
**Endpoint:** `GET /api/content/banners`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "location": "landing",
      "title": "Welcome",
      "subtitle": "Trade with confidence",
      "imageUrl": "https://example.com/banner.jpg",
      "linkUrl": "/market",
      "active": true,
      "priority": 1
    }
  ]
}
```

#### Get Help Articles
**Endpoint:** `GET /api/content/help`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "how-to-trade",
      "title": "How to Trade",
      "content": "...",
      "category": "getting-started",
      "status": "published"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "statusCode": 500
}
```

---

## Rate Limiting

- **General endpoints**: 100 requests/minute
- **Auth endpoints**: 10 requests/minute
- **Trading endpoints**: 50 requests/minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

---

## Testing with cURL

```bash
# Device Init
curl -X POST http://localhost:3001/api/device/init \
  -H "Content-Type: application/json" \
  -d '{}'

# Register
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

# Get Profile (with token)
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Markets
curl -X GET "http://localhost:3001/api/market/list?category=CRYPTOCURRENCY"

# Create Order (with token)
curl -X POST http://localhost:3001/api/order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": "MARKET_UUID",
    "direction": "UP",
    "amount": 100,
    "durationSec": 60
  }'
```
