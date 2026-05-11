-- Smart Laundry Management System - Database Schema
-- Designed for MySQL / phpMyAdmin

CREATE DATABASE IF NOT EXISTS smart_wash_hub;
USE smart_wash_hub;

-- 1. Users Table (Students, Workers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'worker', 'admin') NOT NULL DEFAULT 'student',
    phone VARCHAR(20),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Laundry Orders Table
CREATE TABLE IF NOT EXISTS laundry_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    worker_id INT DEFAULT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    item_count INT NOT NULL,
    status ENUM('submitted', 'washing', 'drying', 'ready', 'delivered') NOT NULL DEFAULT 'submitted',
    payment_status ENUM('unpaid', 'pending', 'paid') NOT NULL DEFAULT 'unpaid',
    qr_code_data VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Clothes Table (Individual items within an order)
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

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method ENUM('cash', 'wallet', 'mobile_money') NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected') NOT NULL DEFAULT 'pending',
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert a default Admin for testing (Password: Admin@123)
-- In production, passwords must be hashed using password_hash()
-- INSERT INTO users (name, email, password, role) VALUES ('System Admin', 'admin@washhub.com', '$2y$10$YourHashedPasswordHere', 'admin');
