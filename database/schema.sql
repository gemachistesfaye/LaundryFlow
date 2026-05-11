-- ============================================================
-- Smart Wash Hub: Production Database Schema
-- University Laundry Management System
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_wash_hub;
USE smart_wash_hub;

-- ============================================================
-- 1. USERS TABLE (All roles: student, worker, deliverer, admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'worker', 'deliverer', 'admin') NOT NULL DEFAULT 'student',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. LAUNDRY ORDERS TABLE (Batch tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS laundry_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    worker_id INT DEFAULT NULL,
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('submitted', 'assigned', 'washing', 'drying', 'ready', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'submitted',
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    item_count INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 3. CLOTHES TABLE (Individual item tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS clothes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('submitted', 'washing', 'drying', 'ready', 'delivered') NOT NULL DEFAULT 'submitted',
    tracking_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    order_id INT DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'cash',
    confirmed_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE SET NULL,
    FOREIGN KEY (confirmed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 5. DELIVERY TASKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS delivery_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deliverer_id INT DEFAULT NULL,
    order_id INT NOT NULL,
    status ENUM('pending', 'picked_up', 'in_transit', 'delivered') DEFAULT 'pending',
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order_update', 'payment', 'assignment', 'system') NOT NULL DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX idx_orders_status ON laundry_orders(status);
CREATE INDEX idx_orders_student ON laundry_orders(student_id);
CREATE INDEX idx_orders_worker ON laundry_orders(worker_id);
CREATE INDEX idx_clothes_tracking ON clothes(tracking_code);
CREATE INDEX idx_delivery_status ON delivery_tasks(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- SEED: Default Admin Account
-- Password: admin123 (bcrypt hashed)
-- ============================================================
INSERT INTO users (username, email, password_hash, role, full_name)
VALUES ('admin', 'admin@smartwash.edu', '$2a$10$8K1p/a0dR1Ux5p6Z5K8Dge3mV5y7p3jX8zK9rQ2sW0vU4tG6hF1Iy', 'admin', 'System Admin')
ON DUPLICATE KEY UPDATE username = username;
