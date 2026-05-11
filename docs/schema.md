# 🗄️ Database Schema: Smart Wash Hub

## Users Table (`users`)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Unique user identifier. |
| `name` | VARCHAR(100) | Full name of the user. |
| `email` | VARCHAR(100) | Unique email address. |
| `password` | VARCHAR(255) | Hashed password. |
| `role` | ENUM | 'student', 'worker', 'admin'. |
| `wallet_balance`| DECIMAL(10,2)| Current balance for payments. |
| `created_at` | TIMESTAMP | Registration date. |

## Clothes Table (`clothes`)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Unique item identifier. |
| `student_id` | INT (FK) | Owner of the cloth. |
| `item_name` | VARCHAR(100) | Description of the item. |
| `status` | ENUM | 'submitted', 'washing', 'drying', 'ready', 'delivered'. |
| `tracking_code`| VARCHAR(50) | Unique tracking code for the item. |

## Orders Table (`laundry_orders`)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Unique order identifier. |
| `user_id` | INT (FK) | Student who placed the order. |
| `worker_id` | INT (FK) | Assigned worker. |
| `status` | ENUM | 'pending', 'processing', 'completed'. |
| `order_date` | TIMESTAMP | Date of submission. |

## Payments Table (`payments`)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK, AI) | Unique payment identifier. |
| `user_id` | INT (FK) | User who made the payment. |
| `amount` | DECIMAL(10,2)| Amount paid. |
| `status` | ENUM | 'pending', 'confirmed'. |
