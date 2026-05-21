-- ============================================================
-- LaundryFlow: Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'worker', 'deliverer', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT '',
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LAUNDRY ORDERS TABLE
CREATE TABLE IF NOT EXISTS laundry_orders (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','assigned','washing','drying','ready','out_for_delivery','delivered','cancelled')),
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    item_count INT NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLOTHES TABLE
CREATE TABLE IF NOT EXISTS clothes (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES laundry_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','washing','drying','ready','delivered')),
    tracking_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES laundry_orders(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected')),
    payment_method VARCHAR(50) DEFAULT 'cash',
    confirmed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DELIVERY TASKS TABLE
CREATE TABLE IF NOT EXISTS delivery_tasks (
    id BIGSERIAL PRIMARY KEY,
    deliverer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    order_id BIGINT NOT NULL REFERENCES laundry_orders(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','picked_up','in_transit','delivered')),
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'system' CHECK (type IN ('order_update','payment','assignment','system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED: Default Admin Account
-- Password: admin123
-- ============================================================
INSERT INTO users (username, email, password_hash, role, full_name)
VALUES ('admin', 'admin@smartwash.edu', '$2a$10$8K1p/a0dR1Ux5p6Z5K8Dge3mV5y7p3jX8zK9rQ2sW0vU4tG6hF1Iy', 'admin', 'System Admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Disable RLS (Row Level Security) for backend service access
-- Run each line separately if needed
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE laundry_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow full access via service role (backend uses anon key with these policies)
CREATE POLICY "Allow all for anon" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON laundry_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON clothes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON delivery_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON notifications FOR ALL USING (true) WITH CHECK (true);
