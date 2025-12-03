# API Documentation - CME Trading Clone

## Base URLs

- **REST API**: `http://localhost:3001`
- **WebSocket**: `ws://localhost:3003`
- **Swagger UI**: `http://localhost:3001/api/docs`

---

## Authentication

### JWT Authentication

Tất cả protected endpoints yêu cầu JWT token trong header:

```http
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### POST /api/auth/register
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+84123456789",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "status": "ACTIVE"
  }
}
```

#### POST /api/auth/login
Đăng nhập

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as register

#### GET /api/auth/profile
Lấy thông tin user hiện tại (Protected)

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Markets

#### GET /api/market/list
Lấy danh sách markets

**Query Parameters:**
- `category` (optional): `GOODS` | `CRYPTOCURRENCY` | `MONEY`

**Response:**
```json
[
  {
    "id": "btc-usdt",
    "symbol": "BTC/USDT",
    "name": "Bitcoin",
    "category": "CRYPTOCURRENCY",
    "isActive": true
  }
]
```

#### GET /api/market/detail/:id
Chi tiết market

**Response:**
```json
{
  "id": "btc-usdt",
  "symbol": "BTC/USDT",
  "name": "Bitcoin",
  "category": "CRYPTOCURRENCY",
  "description": "Bitcoin to USDT trading pair",
  "isActive": true
}
```

---

## Prices

#### GET /api/price/list
Lấy giá hiện tại của markets

**Query Parameters:**
- `symbols` (optional): Comma-separated market IDs

**Response:**
```json
[
  {
    "symbol": "BTC/USDT",
    "price": 42500.50,
    "change24h": 1280.15,
    "changePercent24h": 3.02,
    "high24h": 43200.00,
    "low24h": 41200.00,
    "volume24h": 15420000
  }
]
```

#### GET /api/price/ticker/:symbol
Giá ticker của 1 market

**Response:**
```json
{
  "symbol": "BTC/USDT",
  "price": 42500.50,
  "change24h": 1280.15,
  "changePercent24h": 3.02,
  "high24h": 43200.00,
  "low24h": 41200.00,
  "volume24h": 15420000,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Orders

#### POST /api/order
Tạo lệnh mới (Protected)

**Request Body:**
```json
{
  "marketId": "btc-usdt",
  "type": "BUY_UP",
  "amount": 100,
  "duration": 60
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "marketId": "btc-usdt",
  "type": "BUY_UP",
  "amount": 100,
  "duration": 60,
  "entryPrice": 42500.50,
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/order
Lấy danh sách orders của user (Protected)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `perPage` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "marketId": "btc-usdt",
      "type": "BUY_UP",
      "amount": 100,
      "entryPrice": 42500.50,
      "exitPrice": 42650.00,
      "profit": 5.50,
      "status": "COMPLETED"
    }
  ],
  "total": 50,
  "page": 1,
  "perPage": 10,
  "totalPages": 5
}
```

#### GET /api/order/:id
Chi tiết order (Protected)

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "marketId": "btc-usdt",
  "type": "BUY_UP",
  "amount": 100,
  "duration": 60,
  "entryPrice": 42500.50,
  "exitPrice": 42650.00,
  "profit": 5.50,
  "status": "COMPLETED",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "completedAt": "2024-01-01T00:01:00.000Z"
}
```

---

## Wallet

#### GET /api/wallet/summary
Tổng quan ví (Protected)

**Response:**
```json
{
  "totalBalance": 10250.50,
  "totalProfit": 450.25,
  "totalOrders": 120,
  "winRate": 68.5,
  "wallets": [
    {
      "id": "uuid",
      "currency": "USDT",
      "balance": 8500.25,
      "frozenBalance": 200.00
    }
  ]
}
```

#### GET /api/wallet/history
Lịch sử giao dịch ví (Protected)

**Query Parameters:**
- `page`, `perPage`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "DEPOSIT",
      "currency": "USDT",
      "amount": 1000.00,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "perPage": 10
}
```

---

## Leaderboard

#### GET /api/leaderboard
Bảng xếp hạng traders

**Response:**
```json
[
  {
    "rank": 1,
    "userId": "uuid",
    "username": "trader_pro",
    "totalProfit": 15000.00,
    "winRate": 78.5,
    "totalOrders": 120
  }
]
```

---

## Content

#### GET /api/content/banners
Lấy danh sách banners

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Welcome Banner",
    "description": "Welcome to CME Trading",
    "imageUrl": "https://example.com/banner.jpg",
    "link": "/market",
    "order": 1,
    "isActive": true
  }
]
```

#### GET /api/content/help
Lấy help articles

**Response:**
```json
[
  {
    "id": "uuid",
    "category": "Getting Started",
    "title": "How to trade",
    "content": "Step by step guide...",
    "order": 1,
    "isActive": true
  }
]
```

---

## Admin Endpoints

### Dashboard

#### GET /api/admin/dashboard
Dashboard metrics (Admin only)

**Response:**
```json
{
  "totalUsers": 1234,
  "activeUsers": 456,
  "totalOrders": 5678,
  "ordersToday": 123,
  "totalVolume": 1234567.89,
  "totalProfit": 123456.78,
  "volumeChange": 5.2,
  "profitChange": 8.5
}
```

---

## WebSocket API

### Connection

```javascript
import { io } from 'socket.io-client'

// Price updates
const priceSocket = io('http://localhost:3003/price')

// Order updates
const orderSocket = io('http://localhost:3003/orders')
```

### Price Gateway (`/price` namespace)

#### Subscribe to Markets

**Emit:**
```javascript
socket.emit('subscribe', { 
  markets: ['btc-usdt', 'eth-usdt'] 
})
```

**Response Event:**
```javascript
socket.on('subscribed', (data) => {
  // { markets: ['btc-usdt', 'eth-usdt'], clientId: 'socket-id' }
})
```

#### Receive Price Updates

```javascript
socket.on('priceUpdate', (data) => {
  /*
  {
    marketId: 'btc-usdt',
    symbol: 'BTC/USDT',
    price: 42500.50,
    change24h: 1280.15,
    changePercent24h: 3.02,
    high24h: 43200.00,
    low24h: 41200.00,
    volume24h: 15420000,
    timestamp: '2024-01-01T00:00:00.000Z'
  }
  */
})
```

#### Unsubscribe

```javascript
socket.emit('unsubscribe', { 
  markets: ['btc-usdt'] 
})
```

### Order Gateway (`/orders` namespace)

#### Subscribe to User Orders

**Emit:**
```javascript
socket.emit('subscribeUser', { 
  userId: 'user-uuid' 
})
```

#### Receive Order Updates

```javascript
socket.on('orderUpdate', (data) => {
  /*
  {
    orderId: 'uuid',
    userId: 'uuid',
    marketId: 'btc-usdt',
    type: 'BUY_UP',
    status: 'COMPLETED',
    entryPrice: 42500.50,
    exitPrice: 42650.00,
    profit: 5.50,
    timestamp: '2024-01-01T00:00:00.000Z'
  }
  */
})
```

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- **REST API**: 100 requests per minute per IP
- **WebSocket**: 10 connections per IP

---

## Testing với cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get markets
curl http://localhost:3001/api/market/list

# Create order (with token)
curl -X POST http://localhost:3001/api/order \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"marketId":"btc-usdt","type":"BUY_UP","amount":100,"duration":60}'
```

---

## Support

- Swagger UI: http://localhost:3001/api/docs
- WebSocket Test: Use Socket.IO client or Postman
- Issues: GitHub Issues
