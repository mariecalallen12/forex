-- CME Trading Clone - Initial Database Schema
-- Created: 2025-12-03

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('inactive', 'active', 'locked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_contact_check CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Tokens table
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    decimals INTEGER DEFAULT 8,
    status VARCHAR(20) DEFAULT 'active'
);

-- Markets table
CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(50) NOT NULL UNIQUE,
    base_token_id UUID REFERENCES tokens(id),
    quote_token_id UUID REFERENCES tokens(id),
    category VARCHAR(50) NOT NULL CHECK (category IN ('GOODS', 'CRYPTOCURRENCY', 'MONEY')),
    tick_size DECIMAL(20,8) DEFAULT 0.01,
    min_trade_size DECIMAL(20,8) DEFAULT 10,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_markets_category ON markets(category);
CREATE INDEX idx_markets_status ON markets(status);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(20) NOT NULL,
    balance DECIMAL(20,8) DEFAULT 0 CHECK (balance >= 0),
    locked DECIMAL(20,8) DEFAULT 0 CHECK (locked >= 0),
    UNIQUE(user_id, currency)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    market_id UUID NOT NULL REFERENCES markets(id),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('UP', 'DOWN')),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    duration_sec INTEGER NOT NULL CHECK (duration_sec > 0),
    status VARCHAR(20) DEFAULT 'NEW' CHECK (status IN ('NEW', 'SETTLING', 'SETTLED', 'CANCELED')),
    result VARCHAR(10) CHECK (result IN ('WIN', 'LOSE', 'DRAW')),
    payout_amount DECIMAL(20,8),
    entry_price DECIMAL(20,8),
    exit_price DECIMAL(20,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_market_id ON orders(market_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Banners table
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_active ON banners(active);
CREATE INDEX idx_banners_priority ON banners(priority DESC);

-- Help articles table
CREATE TABLE help_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_help_articles_slug ON help_articles(slug);
CREATE INDEX idx_help_articles_category ON help_articles(category);
CREATE INDEX idx_help_articles_status ON help_articles(status);

-- Audits table
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audits_actor_id ON audits(actor_id);
CREATE INDEX idx_audits_resource_type ON audits(resource_type);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions junction table
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Leaderboard snapshots table
CREATE TABLE leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
    data JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_period ON leaderboard_snapshots(period);
CREATE INDEX idx_leaderboard_generated_at ON leaderboard_snapshots(generated_at DESC);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('user', 'Regular user role'),
    ('admin', 'Administrator role'),
    ('superadmin', 'Super administrator with full access'),
    ('moderator', 'Moderator role for customer support'),
    ('ops', 'Operations team role');

-- Insert default permissions
INSERT INTO permissions (code, description) VALUES
    ('user.read', 'Read user information'),
    ('user.update', 'Update user information'),
    ('user.delete', 'Delete user'),
    ('order.read', 'Read orders'),
    ('order.create', 'Create orders'),
    ('order.force_settle', 'Force settle orders'),
    ('market.read', 'Read market information'),
    ('market.update', 'Update market configuration'),
    ('content.manage_banners', 'Manage banners'),
    ('content.manage_help', 'Manage help articles'),
    ('audit.read', 'Read audit logs');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for help_articles table
CREATE TRIGGER update_help_articles_updated_at BEFORE UPDATE ON help_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO tokens (symbol, name, decimals) VALUES
    ('USDT', 'Tether USD', 2),
    ('BTC', 'Bitcoin', 8),
    ('ETH', 'Ethereum', 8),
    ('XAU', 'Gold', 2),
    ('OIL', 'Crude Oil', 2),
    ('EUR', 'Euro', 4),
    ('GBP', 'British Pound', 4);

INSERT INTO markets (symbol, category, tick_size, min_trade_size) VALUES
    ('BTCUSDT', 'CRYPTOCURRENCY', 0.01, 10),
    ('ETHUSDT', 'CRYPTOCURRENCY', 0.01, 10),
    ('XAUUSD', 'GOODS', 0.01, 10),
    ('OILUSD', 'GOODS', 0.01, 10),
    ('EURUSD', 'MONEY', 0.0001, 10),
    ('GBPUSD', 'MONEY', 0.0001, 10);

COMMENT ON TABLE users IS 'User accounts table';
COMMENT ON TABLE wallets IS 'User wallet balances';
COMMENT ON TABLE orders IS 'Trading orders';
COMMENT ON TABLE markets IS 'Available trading markets';
COMMENT ON TABLE audits IS 'Audit log for all actions';
