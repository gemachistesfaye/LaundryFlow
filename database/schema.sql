-- Smart Wash Hub: Production Database Schema
-- Optimized for MySQL / phpMyAdmin

CREATE DATABASE IF NOT EXISTS smart_wash_hub;
USE smart_wash_hub;

-- 1. Users Table (Unified authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'worker', 'admin', 'coordinator', 'deliverer') NOT NULL DEFAULT 'student',
    phone VARCHAR(20),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    university_id VARCHAR(50),
    dorm_info VARCHAR(100),
    profile_pic_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Laundry Orders Table
CREATE TABLE IF NOT EXISTS laundry_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    worker_id INT DEFAULT NULL,
    coordinator_id INT DEFAULT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    item_count INT NOT NULL DEFAULT 0,
    status ENUM('pending_approval', 'washing', 'drying', 'ready', 'out_for_delivery', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_approval',
    payment_status ENUM('unpaid', 'pending_verification', 'paid') NOT NULL DEFAULT 'unpaid',
    qr_code_data VARCHAR(255) UNIQUE,
    payment_proof_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coordinator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Clothes Table (Individual item tracking)
CREATE TABLE IF NOT EXISTS clothes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    student_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    status ENUM('submitted', 'washing', 'drying', 'ready', 'delivered') NOT NULL DEFAULT 'submitted',
    tracking_code VARCHAR(100) UNIQUE,
    FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('deposit', 'payment', 'refund') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    reference_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order_status', 'payment', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indices for performance
CREATE INDEX idx_order_status ON laundry_orders(status);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_tracking_code ON clothes(tracking_code);
