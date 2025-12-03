// Theme colors
export const COLORS = {
  primary: {
    main: '#3D5AFE',
    dark: '#2C04FE',
  },
  accent: {
    main: '#F7A600',
  },
  success: {
    main: '#00AC47',
  },
  danger: {
    main: '#FF4D4F',
  },
  background: {
    primary: '#13111A',
    secondary: '#121212',
    tertiary: '#26242C',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.6)',
  },
};

// Market categories
export const MARKET_CATEGORIES = {
  GOODS: 'GOODS',
  CRYPTOCURRENCY: 'CRYPTOCURRENCY',
  MONEY: 'MONEY',
} as const;

// Order duration options (in seconds)
export const ORDER_DURATIONS = [
  { label: '1 phút', value: 60, profit: 5 },
  { label: '2 phút', value: 120, profit: 10 },
  { label: '3 phút', value: 180, profit: 15 },
  { label: '5 phút', value: 300, profit: 20 },
  { label: '10 phút', value: 600, profit: 30 },
];

// Order direction
export const ORDER_DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
} as const;

// User status
export const USER_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  LOCKED: 'locked',
} as const;

// Order status
export const ORDER_STATUS = {
  NEW: 'NEW',
  SETTLING: 'SETTLING',
  SETTLED: 'SETTLED',
  CANCELED: 'CANCELED',
} as const;

// Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  MODERATOR: 'moderator',
  OPS: 'ops',
} as const;

// API endpoints base
export const API_ENDPOINTS = {
  DEVICE_INIT: '/api/device/init',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_PROFILE: '/api/auth/profile',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  MARKET_LIST: '/api/market/list',
  PRICE_LIST: '/api/price/list',
  PRICE_TICKER: '/api/price/ticker',
  ORDER_CREATE: '/api/order',
  ORDER_PREVIEW: '/api/order/preview',
  ORDER_HISTORY: '/api/order/history',
  WALLET_SUMMARY: '/api/wallet/summary',
  WALLET_HISTORY: '/api/wallet/history',
  LEADERBOARD: '/api/leaderboard',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LOCALE: 'locale',
} as const;

// Supported languages
export const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
] as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
