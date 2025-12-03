FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally (only once)
RUN npm install -g pnpm@8

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy workspace packages
COPY packages/ ./packages/
COPY services/worker/ ./services/worker/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build worker service
WORKDIR /app/services/worker
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy pnpm from builder instead of reinstalling
COPY --from=builder /usr/local/bin/pnpm /usr/local/bin/pnpm
COPY --from=builder /usr/local/lib/node_modules/pnpm /usr/local/lib/node_modules/pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy built application
COPY --from=builder /app/services/worker/dist ./services/worker/dist
COPY --from=builder /app/services/worker/package.json ./services/worker/
COPY --from=builder /app/packages ./packages

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/services/worker

EXPOSE 3003

CMD ["node", "dist/main.js"]
