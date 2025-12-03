/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cme-trading/shared'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
  images: {
    domains: ['api.demo92.apptestlive.com', 'api.cmetrading.com'],
  },
}

module.exports = nextConfig
