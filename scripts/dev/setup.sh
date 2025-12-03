#!/bin/bash

# Setup script for CME Trading Clone development environment

set -e

echo "🚀 CME Trading Clone - Development Setup"
echo "========================================"

# Check Node.js version
echo ""
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION"

# Check pnpm
echo ""
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
echo "✓ pnpm $PNPM_VERSION"

# Check Docker
echo ""
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Please install Docker manually."
else
    DOCKER_VERSION=$(docker --version)
    echo "✓ $DOCKER_VERSION"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install

# Setup environment files
echo ""
echo "Setting up environment files..."

if [ ! -f "services/api/.env" ]; then
    cp services/api/.env.example services/api/.env
    echo "✓ Created services/api/.env"
fi

if [ ! -f "apps/customer-web/.env.local" ]; then
    cp apps/customer-web/.env.example apps/customer-web/.env.local
    echo "✓ Created apps/customer-web/.env.local"
fi

# Start Docker services
echo ""
echo "Starting Docker services..."
if command -v docker &> /dev/null; then
    docker-compose up -d postgres redis
    echo "✓ PostgreSQL and Redis started"
    
    echo ""
    echo "Waiting for services to be ready..."
    sleep 5
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        echo "✓ Services are running"
    else
        echo "⚠️  Some services may not be running properly"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Terminal 1: pnpm dev:api     (Backend API - http://localhost:3001)"
echo "2. Terminal 2: pnpm dev:customer (Customer Web - http://localhost:3000)"
echo ""
echo "API Documentation: http://localhost:3001/api/docs"
echo ""
