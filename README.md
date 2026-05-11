# 🚀 Smart Wash Hub – University Laundry Management System

A production-grade, full-stack laundry management platform designed for university campuses.

## 📂 Project Structure

- **`/frontend`**: React + Vite + Tailwind CSS. Modern dashboard UI for all user roles.
- **`/backend`**: Node.js + Express + MySQL. Robust REST API for order tracking and payments.
- **`/database`**: MySQL SQL schema files for easy XAMPP import.
- **`/docs`**: System architecture, database schema, and API documentation.

---

## 🌟 Key Features

- **👕 Unique Tracking**: Every clothing item gets a unique ID to prevent loss.
- **💳 Payment System**: Wallet-based system with admin confirmation flow.
- **📊 Role-Based Dashboards**:
  - **Student**: Submit requests, track status, view history.
  - **Worker**: Manage assigned tasks and update processing status.
  - **Admin**: System-wide control, user management, and analytics.
- **⚡ Real-Time Updates**: Real-time status tracking from submission to delivery.

---

## 🛠️ Tech Stack

- **Frontend**: React (JavaScript), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Security**: JWT Authentication, Prepared Statements (SQLi Prevention), Password Hashing.

---

## 📦 Getting Started

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with your MySQL credentials.
4. `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### 3. Database
- Import the SQL schema located in `/docs/schema.sql` (to be generated) into your MySQL server.

---

## 🎯 Project Objective
This system is designed to replace manual, error-prone laundry processes with a digital solution that ensures transparency, speed, and reliability.