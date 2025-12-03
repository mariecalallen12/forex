FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm@8

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

# Install pnpm
RUN npm install -g pnpm@8

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
