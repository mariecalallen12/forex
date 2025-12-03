// User types
export interface User {
  id: string;
  username?: string;
  phone?: string;
  email?: string;
  status: 'inactive' | 'active' | 'locked';
  createdAt: Date;
  updatedAt: Date;
}

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  locked: number;
  available?: number;
}

// Market types
export type MarketCategory = 'GOODS' | 'CRYPTOCURRENCY' | 'MONEY';

export interface Market {
  id: string;
  symbol: string;
  baseToken: string;
  quoteToken: string;
  category: MarketCategory;
  tickSize: number;
  minTradeSize: number;
  status: 'active' | 'inactive';
}

// Price types
export interface PriceTicker {
  marketId: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

// Order types
export type OrderDirection = 'UP' | 'DOWN';
export type OrderStatus = 'NEW' | 'SETTLING' | 'SETTLED' | 'CANCELED';
export type OrderResult = 'WIN' | 'LOSE' | 'DRAW';

export interface Order {
  id: string;
  userId: string;
  marketId: string;
  direction: OrderDirection;
  amount: number;
  durationSec: number;
  status: OrderStatus;
  result?: OrderResult;
  payoutAmount?: number;
  entryPrice?: number;
  exitPrice?: number;
  createdAt: Date;
  settledAt?: Date;
}

// Banner types
export interface Banner {
  id: string;
  location: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  priority: number;
  startsAt?: Date;
  endsAt?: Date;
}

// Help Article types
export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  profitAmount: number;
  profitPercent: number;
  tradesCount: number;
  winRate: number;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  wallets: Wallet[];
}

// Device Init types
export interface DeviceInitResponse {
  tradingViewUrl: string;
  banners: Banner[];
  languages: string[];
  markets: Market[];
  topCoins: PriceTicker[];
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
