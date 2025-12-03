# Realtime WebSocket Service

WebSocket service cho real-time updates trong hệ thống CME Trading Clone.

## Features

### 1. Price Updates (`/price` namespace)
- Real-time price updates cho tất cả markets
- Subscribe/unsubscribe to specific markets
- 2-5 second update intervals
- Realistic price movements (±0.5%)

### 2. Order Updates (`/orders` namespace)
- Real-time order status updates
- User-specific order notifications
- Order completion notifications

## WebSocket Endpoints

### Price Namespace: `ws://localhost:3003/price`

**Events:**
- `subscribe` - Subscribe to market price updates
  ```typescript
  socket.emit('subscribe', { markets: ['btc-usdt', 'eth-usdt'] })
  ```

- `unsubscribe` - Unsubscribe from markets
  ```typescript
  socket.emit('unsubscribe', { markets: ['btc-usdt'] })
  ```

- `priceUpdate` - Receive price updates
  ```typescript
  socket.on('priceUpdate', (data) => {
    // { marketId, symbol, price, change24h, changePercent24h, high24h, low24h, volume24h, timestamp }
  })
  ```

### Order Namespace: `ws://localhost:3003/orders`

**Events:**
- `subscribeUser` - Subscribe to user's order updates
  ```typescript
  socket.emit('subscribeUser', { userId: 'user-id' })
  ```

- `orderUpdate` - Receive order status updates
  ```typescript
  socket.on('orderUpdate', (data) => {
    // { orderId, userId, marketId, type, status, entryPrice, exitPrice, profit, timestamp }
  })
  ```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

```env
PORT=3003
NODE_ENV=development
```

## Architecture

```
services/realtime/
├── src/
│   ├── gateways/
│   │   ├── price.gateway.ts      # Price updates WebSocket
│   │   └── order.gateway.ts      # Order updates WebSocket
│   ├── services/
│   │   └── price-feed.service.ts # Mock price generator
│   ├── modules/
│   │   ├── price.module.ts
│   │   └── order.module.ts
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

## Supported Markets

1. **BTC/USDT** - Bitcoin
2. **ETH/USDT** - Ethereum  
3. **XAU/USD** - Gold
4. **OIL/USD** - Crude Oil
5. **EUR/USD** - Euro
6. **GBP/USD** - British Pound

## Price Update Algorithm

- Base prices initialized from configuration
- Updates every 2-5 seconds (randomized)
- Price change: ±0.5% per update
- Tracks 24h high, low, volume
- Broadcasts only to subscribed clients
