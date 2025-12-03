// Auth Types
export interface LoginRequest {
  email?: string
  phone?: string
  password: string
  deviceId?: string
}

export interface RegisterRequest {
  email?: string
  phone?: string
  password: string
  name?: string
  deviceId?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface User {
  id: string
  email?: string
  phone?: string
  name?: string
  status: string
  createdAt: string
  updatedAt: string
}

// Market Types
export interface Market {
  id: string
  symbol: string
  name: string
  category: 'GOODS' | 'CRYPTOCURRENCY' | 'MONEY'
  description?: string
  isActive: boolean
  createdAt: string
}

export interface MarketPrice {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  timestamp: string
}

// Order Types
export interface CreateOrderRequest {
  marketId: string
  type: 'BUY_UP' | 'BUY_DOWN'
  amount: number
  duration: number // in seconds
}

export interface Order {
  id: string
  userId: string
  marketId: string
  type: 'BUY_UP' | 'BUY_DOWN'
  amount: number
  duration: number
  entryPrice: number
  exitPrice?: number
  profit?: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  completedAt?: string
}

// Wallet Types
export interface Wallet {
  id: string
  userId: string
  currency: string
  balance: number
  frozenBalance: number
  updatedAt: string
}

export interface WalletSummary {
  totalBalance: number
  totalProfit: number
  totalOrders: number
  winRate: number
  wallets: Wallet[]
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  totalProfit: number
  winRate: number
  totalOrders: number
}

// Content Types
export interface Banner {
  id: string
  title: string
  description?: string
  imageUrl: string
  link?: string
  order: number
  isActive: boolean
}

export interface HelpArticle {
  id: string
  category: string
  title: string
  content: string
  order: number
  isActive: boolean
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// Error Response
export interface ApiError {
  statusCode: number
  message: string
  error?: string
}
