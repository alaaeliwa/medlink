-- =============================================================================
-- MedLink — Week 9 Database Schema + Sample Data
-- Engine: MySQL 8.0+ (InnoDB, utf8mb4)
-- Source: Derived from Laravel migrations in backend/database/migrations/
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Optional: create a dedicated schema for coursework
-- CREATE DATABASE IF NOT EXISTS medlink_week9 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE medlink_week9;

-- ---------------------------------------------------------------------------
-- DROP (child tables first)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `inventory_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `broadcast_requests`;
DROP TABLE IF EXISTS `complaints`;
DROP TABLE IF EXISTS `medicines`;
DROP TABLE IF EXISTS `pharmacies`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- USERS (accounts: citizens, pharmacy staff, admins)
-- PK: id
-- ---------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NULL,
  `address` TEXT NULL,
  `role` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- CATEGORIES → MEDICINES (1:N) — avoids repeating category strings per drug
-- ---------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `medicines` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `generic_name` VARCHAR(255) NULL,
  `strength` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `form` ENUM('tablet','capsule','liquid','cream','injection') NOT NULL DEFAULT 'tablet',
  `manufacturer` VARCHAR(255) NULL,
  `stock` INT NOT NULL,
  `description` TEXT NULL,
  `requires_prescription` TINYINT(1) NOT NULL DEFAULT 0,
  `is_controlled` TINYINT(1) NOT NULL DEFAULT 0,
  `expiry_date` DATE NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medicines_category_id_foreign` (`category_id`),
  CONSTRAINT `medicines_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- PHARMACIES (1:1 profile row per pharmacy user in this model)
-- FK: user_id → users
-- ---------------------------------------------------------------------------
CREATE TABLE `pharmacies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `pharmacy_name` VARCHAR(255) NOT NULL,
  `license_number` VARCHAR(255) NOT NULL,
  `license_expiry` DATE NULL,
  `address` TEXT NOT NULL,
  `area` VARCHAR(255) NULL,
  `latitude` DECIMAL(10,8) NULL,
  `longitude` DECIMAL(11,8) NULL,
  `delivery_available` TINYINT(1) NOT NULL DEFAULT 0,
  `delivery_fee` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `review_count` INT NOT NULL DEFAULT 0,
  `status` ENUM('pending','verified','rejected','suspended') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pharmacies_license_number_unique` (`license_number`),
  KEY `pharmacies_user_id_foreign` (`user_id`),
  CONSTRAINT `pharmacies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- INVENTORY_ITEMS — stock per (pharmacy, medicine); UNIQUE pair = no duplicate rows
-- ---------------------------------------------------------------------------
CREATE TABLE `inventory_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pharmacy_id` BIGINT UNSIGNED NOT NULL,
  `medicine_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `price` DECIMAL(8,2) NOT NULL,
  `cost_price` DECIMAL(8,2) NULL,
  `minimum_stock` INT NOT NULL DEFAULT 10,
  `maximum_stock` INT NOT NULL DEFAULT 500,
  `status` ENUM('in_stock','low_stock','out_of_stock') NOT NULL DEFAULT 'in_stock',
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_items_pharmacy_medicine_unique` (`pharmacy_id`,`medicine_id`),
  KEY `inventory_items_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `inventory_items_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inventory_items_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- ORDERS — citizen + pharmacy (user account) + line-level detail in order_items
-- Note: Laravel migration links pharmacy_id → users(id) for the pharmacy account.
-- ---------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` VARCHAR(255) NOT NULL,
  `citizen_id` BIGINT UNSIGNED NOT NULL,
  `medicines` JSON NOT NULL,
  `pharmacy_id` BIGINT UNSIGNED NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `urgency` ENUM('standard','urgent','critical') NOT NULL DEFAULT 'standard',
  `status` ENUM('pending','approved','rejected','preparing','ready','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
  `status_timeline` JSON NULL,
  `pharmacy_response` TEXT NULL,
  `response_date` TIMESTAMP NULL DEFAULT NULL,
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expected_delivery` TIMESTAMP NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_citizen_id_foreign` (`citizen_id`),
  KEY `orders_pharmacy_id_foreign` (`pharmacy_id`),
  CONSTRAINT `orders_citizen_id_foreign` FOREIGN KEY (`citizen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` VARCHAR(255) NOT NULL,
  `medicine_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(8,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_medicine_id_foreign` (`medicine_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_medicine_id_foreign` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- BROADCAST_REQUESTS — citizen-wide medicine request
-- ---------------------------------------------------------------------------
CREATE TABLE `broadcast_requests` (
  `id` VARCHAR(255) NOT NULL,
  `citizen_id` BIGINT UNSIGNED NOT NULL,
  `medicine_name` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `notes` TEXT NULL,
  `urgency` ENUM('standard','urgent','critical') NOT NULL DEFAULT 'standard',
  `status` ENUM('open','accepted','expired','closed') NOT NULL DEFAULT 'open',
  `responses` JSON NULL,
  `accepted_pharmacy_id` BIGINT UNSIGNED NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `closed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `broadcast_requests_citizen_id_foreign` (`citizen_id`),
  KEY `broadcast_requests_accepted_pharmacy_id_foreign` (`accepted_pharmacy_id`),
  CONSTRAINT `broadcast_requests_citizen_id_foreign` FOREIGN KEY (`citizen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `broadcast_requests_accepted_pharmacy_id_foreign` FOREIGN KEY (`accepted_pharmacy_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- REVIEWS — one review per (citizen, pharmacy) pair
-- ---------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `citizen_id` BIGINT UNSIGNED NOT NULL,
  `pharmacy_id` BIGINT UNSIGNED NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL,
  `review_text` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_citizen_pharmacy_unique` (`citizen_id`,`pharmacy_id`),
  KEY `reviews_pharmacy_id_foreign` (`pharmacy_id`),
  CONSTRAINT `reviews_citizen_id_foreign` FOREIGN KEY (`citizen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_pharmacy_id_foreign` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- FAVORITES — polymorphic-style (medicine OR pharmacy) with optional JSON snapshot
-- ---------------------------------------------------------------------------
CREATE TABLE `favorites` (
  `id` CHAR(36) NOT NULL,
  `citizen_id` BIGINT UNSIGNED NOT NULL,
  `favorite_type` ENUM('medicine','pharmacy') NOT NULL,
  `favorite_id` VARCHAR(255) NOT NULL,
  `favorite_data` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorites_unique` (`citizen_id`,`favorite_type`,`favorite_id`),
  KEY `favorites_citizen_id_foreign` (`citizen_id`),
  CONSTRAINT `favorites_citizen_id_foreign` FOREIGN KEY (`citizen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- COMPLAINTS — reporter vs pharmacy user + optional admin assignee
-- ---------------------------------------------------------------------------
CREATE TABLE `complaints` (
  `id` VARCHAR(255) NOT NULL,
  `reporter_id` BIGINT UNSIGNED NOT NULL,
  `against_pharmacy_id` BIGINT UNSIGNED NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `details` TEXT NOT NULL,
  `severity` ENUM('low','medium','high','critical') NOT NULL DEFAULT 'low',
  `status` ENUM('open','in_review','resolved','rejected') NOT NULL DEFAULT 'open',
  `assigned_admin_id` BIGINT UNSIGNED NULL,
  `resolution` TEXT NULL,
  `resolution_date` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complaints_reporter_id_foreign` (`reporter_id`),
  KEY `complaints_against_pharmacy_id_foreign` (`against_pharmacy_id`),
  KEY `complaints_assigned_admin_id_foreign` (`assigned_admin_id`),
  CONSTRAINT `complaints_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `complaints_against_pharmacy_id_foreign` FOREIGN KEY (`against_pharmacy_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `complaints_assigned_admin_id_foreign` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SAMPLE DATA (bcrypt hash below = Laravel default "password")
-- =============================================================================
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `address`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Nour', 'Admin', 'admin@medlink.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'admin', 1, NOW(), NOW()),
(2, 'Ahmed', 'Citizen', 'ahmed.citizen@medlink.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+970500000001', 'Gaza City', 'citizen', 1, NOW(), NOW()),
(3, 'Sara', 'Citizen', 'sara.citizen@medlink.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+970500000002', 'Rafah', 'citizen', 1, NOW(), NOW()),
(4, 'Khaled', 'Pharmacist', 'care.pharmacy@medlink.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+970500000003', 'Downtown', 'pharmacy', 1, NOW(), NOW()),
(5, 'Mona', 'Pharmacist', 'life.pharmacy@medlink.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+970500000004', 'North District', 'pharmacy', 1, NOW(), NOW());

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pain Relief', 'Analgesics and NSAIDs', NOW(), NOW()),
(2, 'Antibiotics', 'Antibacterial agents', NOW(), NOW()),
(3, 'Cardiology', 'Heart and blood pressure', NOW(), NOW());

INSERT INTO `medicines` (`id`, `category_id`, `name`, `generic_name`, `strength`, `price`, `form`, `manufacturer`, `stock`, `description`, `requires_prescription`, `is_controlled`, `expiry_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Panadol Extra', 'Paracetamol + Caffeine', '500mg', 5.00, 'tablet', 'GSK', 5000, 'Pain and fever', 0, 0, '2027-12-01', 1, NOW(), NOW()),
(2, 2, 'Augmentin', 'Amoxicillin/Clavulanate', '1g', 18.50, 'tablet', 'GSK', 1200, 'Bacterial infections', 1, 0, '2026-11-15', 1, NOW(), NOW()),
(3, 3, 'Concor', 'Bisoprolol', '5mg', 14.20, 'tablet', 'Merck', 800, 'Hypertension', 1, 0, '2027-03-01', 1, NOW(), NOW());

INSERT INTO `pharmacies` (`id`, `user_id`, `pharmacy_name`, `license_number`, `license_expiry`, `address`, `area`, `latitude`, `longitude`, `delivery_available`, `delivery_fee`, `rating`, `review_count`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 'Care Pharmacy', 'PH-LIC-0001', '2028-01-01', 'Main Street, Downtown', 'Downtown', 31.50000000, 34.45000000, 1, 2.50, 4.70, 2, 'verified', NOW(), NOW()),
(2, 5, 'LifeStyle Pharmacy', 'PH-LIC-0002', '2027-06-01', 'North District Mall', 'North District', 31.52000000, 34.46000000, 0, 0.00, 4.50, 0, 'verified', NOW(), NOW());

INSERT INTO `inventory_items` (`id`, `pharmacy_id`, `medicine_id`, `quantity`, `price`, `cost_price`, `minimum_stock`, `maximum_stock`, `status`, `expiry_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 120, 5.50, 3.80, 20, 400, 'in_stock', '2027-06-01', NOW(), NOW()),
(2, 1, 2, 8, 19.00, 14.00, 10, 200, 'low_stock', '2026-10-01', NOW(), NOW()),
(3, 1, 3, 0, 15.00, 11.00, 5, 150, 'out_of_stock', NULL, NOW(), NOW()),
(4, 2, 1, 200, 5.00, 3.50, 30, 500, 'in_stock', '2027-08-01', NOW(), NOW());

INSERT INTO `orders` (`id`, `citizen_id`, `medicines`, `pharmacy_id`, `total_price`, `urgency`, `status`, `notes`, `status_timeline`, `pharmacy_response`, `response_date`, `order_date`, `expected_delivery`, `completed_at`, `created_at`, `updated_at`) VALUES
('ORD-20260519-001', 2, CAST('[{"medicine_id":1,"qty":2}]' AS JSON), 4, 11.00, 'standard', 'approved', 'Please deliver evening', CAST('[{"status":"pending","at":"2026-05-19T10:00:00Z"}]' AS JSON), 'Approved — preparing', '2026-05-19 10:30:00', '2026-05-19 09:00:00', '2026-05-19 18:00:00', NULL, NOW(), NOW());

INSERT INTO `order_items` (`id`, `order_id`, `medicine_id`, `quantity`, `unit_price`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 'ORD-20260519-001', 1, 2, 5.50, 11.00, NOW(), NOW());

INSERT INTO `broadcast_requests` (`id`, `citizen_id`, `medicine_name`, `quantity`, `notes`, `urgency`, `status`, `responses`, `accepted_pharmacy_id`, `expires_at`, `closed_at`, `created_at`, `updated_at`) VALUES
('REQ-20260519-001', 3, 'RareBrand Syrup', 1, 'Patient chronic condition', 'urgent', 'open', CAST('[]' AS JSON), NULL, '2026-05-26 23:59:59', NULL, NOW(), NOW());

INSERT INTO `reviews` (`id`, `citizen_id`, `pharmacy_id`, `rating`, `review_text`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 4.5, 'Fast service and clear communication.', NOW(), NOW()),
(2, 3, 1, 5.0, 'Very helpful pharmacist.', NOW(), NOW());

INSERT INTO `favorites` (`id`, `citizen_id`, `favorite_type`, `favorite_id`, `favorite_data`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 2, 'medicine', '1', JSON_OBJECT('name', 'Panadol Extra'), NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 2, 'pharmacy', '1', JSON_OBJECT('name', 'Care Pharmacy'), NOW(), NOW());

INSERT INTO `complaints` (`id`, `reporter_id`, `against_pharmacy_id`, `subject`, `details`, `severity`, `status`, `assigned_admin_id`, `resolution`, `resolution_date`, `created_at`, `updated_at`) VALUES
('CP-20260519-001', 3, 4, 'Late delivery', 'Order was 2 hours late.', 'medium', 'in_review', 1, NULL, NULL, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- End of Week 9 schema + sample data
