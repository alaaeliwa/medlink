# 🔧 MedLink Backend Development Roadmap
## For Backend Developers (Laravel API)

---

## 📋 Executive Summary

**MedLink** is transitioning from a **Frontend-Only Prototype** (LocalStorage) to a **Full-Stack Application** with Laravel Backend. This document outlines:

1. ✅ **Current Frontend Architecture** - What exists today
2. 📊 **Data Models & Entities** - Database schema design
3. 🔌 **Required API Endpoints** - RESTful specifications
4. 🔐 **Authentication & Authorization** - Role-based access
5. 🚀 **Implementation Priority** - Phased rollout plan

---

## Part 1️⃣: Current Frontend Architecture

### 1.1 Project Structure Overview

```
frontend/
├── index.html                    # Landing page
├── auth/
│   ├── login.html               # Combined login (Citizen/Pharmacy/Admin)
│   └── register.html            # Registration form
├── citizen/                      # Citizen Dashboard & Features
│   ├── citizen-dashboard.html    # Main dashboard
│   ├── medicines.html           # Medicine search & browse
│   ├── pharmacies.html          # Pharmacy listing
│   ├── medicine-details.html    # Single medicine details
│   ├── pharmacy-details.html    # Single pharmacy details
│   ├── favorites.html           # Saved medicines & pharmacies
│   ├── requests.html            # Broadcast requests management
│   ├── settings.html            # User profile & preferences
│   └── 404.html                 # Error page
├── pharmacy/                     # Pharmacy Dashboard & Management
│   ├── pharmacy-dashboard.html  # Main pharmacy dashboard
│   ├── pharmacy-orders.html     # Order management
│   └── pharmacy-settings.html   # Inventory & profile
├── admin/                        # Admin Dashboard & Controls
│   ├── admin-dashboard.html     # Main admin dashboard
│   ├── admin-users.html         # User management
│   ├── admin-medicines.html     # Medicine management
│   ├── admin-pharmacies.html    # Pharmacy verification
│   └── admin-reports.html       # Analytics & reports
├── js/
│   ├── data-engine.js           # Pagination, filtering, sorting
│   ├── orders-engine.js         # Order & complaint management
│   ├── medlink-ui.js            # Toast & modal components
│   ├── login.js                 # Authentication logic
│   ├── register.js              # Registration logic
│   ├── citizen-dashboard.js     # Citizen-specific logic
│   ├── pharmacy'Dashboard.js    # Pharmacy dashboard logic
│   ├── pharmacy-orders.js       # Pharmacy order handling
│   ├── admin-dashboard.js       # Admin features
│   └── home.js                  # Homepage interactions
└── css/
    ├── global.css               # Global styles & variables
    ├── home.css                 # Homepage styles
    ├── login.css                # Auth page styles
    ├── register.css             # Register page styles
    └── [component].css          # Role-specific styles
```

### 1.2 Current Technology Stack

- **Frontend Framework:** Vanilla HTML/CSS/JavaScript (ES6+)
- **UI Libraries:** Font Awesome 6.5.0, Google Fonts (Outfit, Inter)
- **Styling Approach:** CSS3 with Flexbox/Grid, CSS Variables, Glassmorphism
- **State Management:** LocalStorage (temporary - to be replaced by API)
- **Data Format:** JSON
- **No external JS frameworks** - Pure vanilla JavaScript

---

## Part 2️⃣: Data Models & Database Schema

### 2.1 User Model (3 Roles)

#### 2.1.1 Citizen
```json
{
  "id": 1,
  "firstName": "Ahmed",
  "lastName": "Ali",
  "email": "ahmed@example.com",
  "password": "hashed_password",
  "phone": "961712345678",
  "address": "Downtown Beirut",
  "profileImage": "url_to_image",
  "role": "citizen",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:20:00Z",
  "isActive": true
}
```

**Database Fields:**
- `id` (PK, UUID)
- `first_name` (string, 100)
- `last_name` (string, 100)
- `email` (unique, string, 255)
- `password` (hashed)
- `phone` (string, 20)
- `address` (text, nullable)
- `profile_image` (url, nullable)
- `role` (enum: citizen, pharmacy, admin)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at` (timestamps)

#### 2.1.2 Pharmacy
```json
{
  "id": 2,
  "name": "Al Shifa Pharmacy",
  "email": "alshifa@pharmacy.com",
  "password": "hashed_password",
  "phone": "961123456789",
  "licenseNumber": "PH-2024-001",
  "licenseExpiry": "2025-06-30",
  "address": "Downtown, Street 5",
  "latitude": 33.8886,
  "longitude": 35.4955,
  "area": "Downtown",
  "profileImage": "url_to_logo",
  "role": "pharmacy",
  "status": "verified",
  "workingHours": {
    "monday": "08:00-22:00",
    "tuesday": "08:00-22:00",
    "wednesday": "08:00-22:00",
    "thursday": "08:00-22:00",
    "friday": "10:00-20:00",
    "saturday": "10:00-20:00",
    "sunday": "closed"
  },
  "deliveryAvailable": true,
  "deliveryFee": 5.0,
  "rating": 4.9,
  "reviewCount": 120,
  "createdAt": "2023-06-01T00:00:00Z",
  "updatedAt": "2024-01-25T12:00:00Z",
  "isActive": true
}
```

**Database Fields:**
- `id` (PK, UUID)
- `name` (string, 255)
- `email` (unique, string, 255)
- `password` (hashed)
- `phone` (string, 20)
- `license_number` (unique, string, 100)
- `license_expiry` (date)
- `address` (text)
- `latitude` (decimal 10,8, nullable)
- `longitude` (decimal 10,8, nullable)
- `area` (string, 100)
- `profile_image` (url, nullable)
- `role` (enum: pharmacy)
- `status` (enum: pending, verified, rejected, suspended)
- `working_hours` (json)
- `delivery_available` (boolean)
- `delivery_fee` (decimal 10,2)
- `rating` (decimal 3,2, default: 0)
- `review_count` (integer, default: 0)
- `is_active` (boolean)
- `created_at`, `updated_at`

#### 2.1.3 Admin
```json
{
  "id": 3,
  "firstName": "System",
  "lastName": "Admin",
  "email": "admin@medlink.com",
  "password": "hashed_password",
  "role": "admin",
  "permissions": ["manage_users", "manage_medicines", "manage_pharmacies", "view_reports"],
  "createdAt": "2023-01-01T00:00:00Z",
  "isActive": true
}
```

**Database Fields:**
- `id` (PK, UUID)
- `first_name` (string, 100)
- `last_name` (string, 100)
- `email` (unique, string, 255)
- `password` (hashed)
- `role` (enum: admin)
- `permissions` (json array)
- `is_active` (boolean)
- `created_at`, `updated_at`

---

### 2.2 Medicine Model

```json
{
  "id": 1,
  "name": "Panadol Extra (500mg)",
  "genericName": "Paracetamol",
  "category": "Pain Relief",
  "strength": "500mg",
  "form": "Tablet",
  "manufacturer": "GlaxoSmithKline",
  "description": "Effective pain and fever relief",
  "sideEffects": "Rare: liver problems if over-used",
  "precautions": "Not for children under 6 years",
  "activeIngredients": ["Paracetamol 500mg"],
  "requiresPrescription": false,
  "isControlled": false,
  "expiryDate": "2026-12-31",
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-01-25T12:00:00Z",
  "isActive": true
}
```

**Database Fields:**
- `id` (PK, UUID)
- `name` (string, 255)
- `generic_name` (string, 255)
- `category` (string, 100) → Foreign Key to Categories
- `strength` (string, 100)
- `form` (enum: tablet, capsule, liquid, injection, cream, etc.)
- `manufacturer` (string, 255)
- `description` (text)
- `side_effects` (text, nullable)
- `precautions` (text, nullable)
- `active_ingredients` (json)
- `requires_prescription` (boolean, default: false)
- `is_controlled` (boolean, default: false)
- `expiry_date` (date)
- `is_active` (boolean)
- `created_at`, `updated_at`

---

### 2.3 Pharmacy Inventory (Medicines in Stock)

```json
{
  "id": 1,
  "pharmacyId": 2,
  "medicineId": 1,
  "quantity": 150,
  "price": 5.00,
  "costPrice": 3.50,
  "minimumStock": 20,
  "maximumStock": 500,
  "lastRestockDate": "2024-01-20T10:15:00Z",
  "expiryDate": "2025-12-31",
  "status": "in_stock",
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-01-25T12:00:00Z"
}
```

**Database Fields:**
- `id` (PK, UUID)
- `pharmacy_id` (FK → Pharmacies)
- `medicine_id` (FK → Medicines)
- `quantity` (integer)
- `price` (decimal 10,2) - selling price
- `cost_price` (decimal 10,2) - cost to pharmacy
- `minimum_stock` (integer) - reorder level
- `maximum_stock` (integer)
- `last_restock_date` (timestamp, nullable)
- `expiry_date` (date)
- `status` (enum: in_stock, low_stock, out_of_stock)
- `created_at`, `updated_at`
- **Unique Index:** (pharmacy_id, medicine_id)

---

### 2.4 Order Model

```json
{
  "id": "ORD-1705305600000",
  "citizenId": 1,
  "pharmacyId": 2,
  "medicines": [
    {
      "medicineId": 1,
      "medicineName": "Panadol Extra (500mg)",
      "quantity": 2,
      "unitPrice": 5.00,
      "subtotal": 10.00
    }
  ],
  "totalPrice": 10.00,
  "urgency": "standard",
  "notes": "Please pack carefully",
  "status": "pending",
  "statusTimeline": [
    {
      "status": "pending",
      "timestamp": "2024-01-15T10:30:00Z",
      "notes": "Order received"
    },
    {
      "status": "approved",
      "timestamp": "2024-01-15T10:45:00Z",
      "notes": "Pharmacy approved"
    }
  ],
  "pharmacyResponse": null,
  "responseDate": null,
  "orderDate": "2024-01-15T10:30:00Z",
  "expectedDelivery": "2024-01-15T16:30:00Z",
  "completedDate": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:45:00Z"
}
```

**Database Fields:**
- `id` (PK, string - pattern: ORD-{timestamp})
- `citizen_id` (FK → Users where role=citizen)
- `pharmacy_id` (FK → Users where role=pharmacy)
- `medicines` (json array of objects)
- `total_price` (decimal 10,2)
- `urgency` (enum: standard, urgent, critical)
- `notes` (text, nullable)
- `status` (enum: pending, approved, rejected, preparing, ready, delivered, cancelled)
- `status_timeline` (json array - audit trail)
- `pharmacy_response` (text, nullable)
- `response_date` (timestamp, nullable)
- `order_date` (timestamp)
- `expected_delivery` (timestamp, nullable)
- `completed_date` (timestamp, nullable)
- `created_at`, `updated_at`

---

### 2.5 Broadcast Request Model (Network-wide Search)

```json
{
  "id": "REQ-1705305600000",
  "citizenId": 1,
  "medicineName": "Aspirin 500mg",
  "quantity": 5,
  "notes": "Need urgently",
  "urgency": "urgent",
  "status": "open",
  "responses": [
    {
      "pharmacyId": 2,
      "pharmacyName": "Al Shifa Pharmacy",
      "price": 8.00,
      "quantity": 10,
      "responseTime": "2024-01-15T10:35:00Z",
      "status": "pending"
    }
  ],
  "acceptedPharmacyId": 2,
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T12:30:00Z",
  "closedAt": null,
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

**Database Fields:**
- `id` (PK, string - pattern: REQ-{timestamp})
- `citizen_id` (FK → Users where role=citizen)
- `medicine_name` (string, 255)
- `quantity` (integer)
- `notes` (text, nullable)
- `urgency` (enum: standard, urgent, critical)
- `status` (enum: open, accepted, expired, closed)
- `responses` (json array - pharmacy responses)
- `accepted_pharmacy_id` (FK → Users where role=pharmacy, nullable)
- `created_at` (timestamp)
- `expires_at` (timestamp) - 2 hours by default
- `closed_at` (timestamp, nullable)
- `updated_at` (timestamp)

---

### 2.6 Complaint Model

```json
{
  "id": "CP-1705305600000",
  "reporterId": 1,
  "againstPharmacyId": 2,
  "subject": "Wrong medicine received",
  "details": "I ordered Panadol but received Aspirin instead",
  "severity": "high",
  "status": "open",
  "assignedAdminId": null,
  "resolution": null,
  "resolutionDate": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Database Fields:**
- `id` (PK, string - pattern: CP-{timestamp})
- `reporter_id` (FK → Users)
- `against_pharmacy_id` (FK → Users where role=pharmacy)
- `subject` (string, 255)
- `details` (text)
- `severity` (enum: low, medium, high, critical)
- `status` (enum: open, in_review, resolved, rejected)
- `assigned_admin_id` (FK → Users where role=admin, nullable)
- `resolution` (text, nullable)
- `resolution_date` (timestamp, nullable)
- `created_at`, `updated_at`

---

### 2.7 Review/Rating Model

```json
{
  "id": 1,
  "citizenId": 1,
  "pharmacyId": 2,
  "rating": 4.9,
  "reviewText": "Excellent service, fast delivery",
  "createdAt": "2024-01-15T16:30:00Z",
  "updatedAt": "2024-01-15T16:30:00Z"
}
```

**Database Fields:**
- `id` (PK, UUID)
- `citizen_id` (FK → Users where role=citizen)
- `pharmacy_id` (FK → Users where role=pharmacy)
- `rating` (decimal 2,1) - range 1-5
- `review_text` (text, nullable)
- `created_at`, `updated_at`
- **Unique Index:** (citizen_id, pharmacy_id)

---

### 2.8 Favorite Model

```json
{
  "id": 1,
  "citizenId": 1,
  "favoriteType": "medicine",
  "favoriteId": 1,
  "favoriteData": {
    "name": "Panadol Extra",
    "category": "Pain Relief",
    "price": 5.00
  },
  "createdAt": "2024-01-10T00:00:00Z"
}
```

**Database Fields:**
- `id` (PK, UUID)
- `citizen_id` (FK → Users where role=citizen)
- `favorite_type` (enum: medicine, pharmacy)
- `favorite_id` (string/uuid)
- `favorite_data` (json - snapshot)
- `created_at`
- **Unique Index:** (citizen_id, favorite_type, favorite_id)

---

### 2.9 Category Model

```json
{
  "id": 1,
  "name": "Pain Relief",
  "description": "Medicines for pain management",
  "icon": "url_to_icon",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Database Fields:**
- `id` (PK, UUID)
- `name` (unique, string, 255)
- `description` (text, nullable)
- `icon` (url, nullable)
- `created_at`, `updated_at`

---

## Part 3️⃣: Required API Endpoints

### 3.1 Base Configuration

```
Base URL: https://api.medlink.com/api/v1
Authentication: Bearer Token (JWT)
Content-Type: application/json
Response Format: JSON
```

---

### 3.2 Authentication Endpoints

#### 3.2.1 Register (All Roles)
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "email": "ahmed@example.com",
  "password": "securePassword123",
  "phone": "961712345678",
  "role": "citizen",  // citizen, pharmacy
  
  // If role is pharmacy, include:
  "pharmacyName": "Al Shifa Pharmacy",
  "address": "Downtown, Street 5",
  "licenseNumber": "PH-2024-001",
  "deliveryAvailable": true,
  "deliveryFee": 5.0
}

Response (201 Created):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "email": "ahmed@example.com",
    "role": "citizen",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3.2.2 Login
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "ahmed@example.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "ahmed@example.com",
    "firstName": "Ahmed",
    "lastName": "Ali",
    "role": "citizen",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

#### 3.2.3 Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Logout successful"
}
```

#### 3.2.4 Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 3.3 User Profile Endpoints

#### 3.3.1 Get Current User Profile
```http
GET /users/me
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Ahmed",
    "lastName": "Ali",
    "email": "ahmed@example.com",
    "phone": "961712345678",
    "address": "Downtown Beirut",
    "profileImage": "https://...",
    "role": "citizen",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3.3.2 Update User Profile
```http
PUT /users/me
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "phone": "961712345678",
  "address": "Downtown Beirut"
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated",
  "data": { ...updated user object }
}
```

#### 3.3.3 Change Password
```http
POST /users/change-password
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### 3.3.4 Upload Profile Image
```http
POST /users/upload-avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
- file: [binary image file]

Response (200 OK):
{
  "success": true,
  "data": {
    "profileImage": "https://api.medlink.com/uploads/avatars/user_123.jpg"
  }
}
```

---

### 3.4 Medicines Endpoints

#### 3.4.1 Get All Medicines (Public)
```http
GET /medicines?page=1&per_page=12&category=Pain_Relief&sort=price_asc&search=panadol
Authorization: Bearer {token}

Query Parameters:
- page: int (default: 1)
- per_page: int (default: 12)
- category: string (optional)
- sort: enum [default, price_asc, price_desc, name_asc, availability] (default: default)
- search: string (optional, fuzzy search)

Response (200 OK):
{
  "success": true,
  "data": {
    "medicines": [
      {
        "id": 1,
        "name": "Panadol Extra (500mg)",
        "genericName": "Paracetamol",
        "category": "Pain Relief",
        "strength": "500mg",
        "form": "Tablet",
        "manufacturer": "GlaxoSmithKline",
        "description": "Effective pain and fever relief",
        "requiresPrescription": false,
        "pharmaciesCount": 12,
        "averagePrice": 5.00,
        "lowestPrice": 4.50,
        "highestPrice": 5.50,
        "isFavorite": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 12,
      "total": 45,
      "last_page": 4
    }
  }
}
```

#### 3.4.2 Get Medicine Details
```http
GET /medicines/:medicineId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Panadol Extra (500mg)",
    "genericName": "Paracetamol",
    "category": "Pain Relief",
    "strength": "500mg",
    "form": "Tablet",
    "manufacturer": "GlaxoSmithKline",
    "description": "Effective pain and fever relief",
    "sideEffects": "Rare: liver problems if over-used",
    "precautions": "Not for children under 6 years",
    "activeIngredients": ["Paracetamol 500mg"],
    "requiresPrescription": false,
    "isControlled": false,
    "availableAt": [
      {
        "pharmacyId": 2,
        "pharmacyName": "Al Shifa Pharmacy",
        "price": 5.00,
        "quantity": 150,
        "area": "Downtown",
        "rating": 4.9,
        "distance": 0.5
      }
    ],
    "isFavorite": false,
    "reviews": [
      {
        "rating": 5,
        "reviewText": "Great quality",
        "customerName": "Ahmed",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

#### 3.4.3 Get Categories (Public)
```http
GET /medicines/categories
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pain Relief",
      "description": "Medicines for pain management",
      "icon": "https://...",
      "medicineCount": 15
    },
    {
      "id": 2,
      "name": "Antibiotics",
      "description": "Antibacterial medications",
      "icon": "https://...",
      "medicineCount": 22
    }
  ]
}
```

---

### 3.5 Pharmacy Endpoints

#### 3.5.1 Get All Pharmacies (Public)
```http
GET /pharmacies?page=1&per_page=12&area=Downtown&sort=rating&search=shifa
Authorization: Bearer {token}

Query Parameters:
- page: int (default: 1)
- per_page: int (default: 12)
- area: string (optional)
- sort: enum [default, rating_high, rating_low, nearest] (default: default)
- search: string (optional)

Response (200 OK):
{
  "success": true,
  "data": {
    "pharmacies": [
      {
        "id": 2,
        "name": "Al Shifa Pharmacy",
        "area": "Downtown",
        "address": "Street 5, Downtown",
        "rating": 4.9,
        "reviewCount": 120,
        "status": "Open Now",
        "profileImage": "https://...",
        "latitude": 33.8886,
        "longitude": 35.4955,
        "distance": 0.5,
        "deliveryAvailable": true,
        "deliveryFee": 5.0
      }
    ],
    "pagination": { ... }
  }
}
```

#### 3.5.2 Get Pharmacy Details
```http
GET /pharmacies/:pharmacyId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Al Shifa Pharmacy",
    "email": "alshifa@pharmacy.com",
    "phone": "961123456789",
    "address": "Street 5, Downtown",
    "area": "Downtown",
    "latitude": 33.8886,
    "longitude": 35.4955,
    "rating": 4.9,
    "reviewCount": 120,
    "profileImage": "https://...",
    "workingHours": {
      "monday": "08:00-22:00",
      "tuesday": "08:00-22:00",
      "wednesday": "08:00-22:00",
      "thursday": "08:00-22:00",
      "friday": "10:00-20:00",
      "saturday": "10:00-20:00",
      "sunday": "closed"
    },
    "deliveryAvailable": true,
    "deliveryFee": 5.0,
    "medicines": [
      {
        "medicineId": 1,
        "medicineName": "Panadol Extra",
        "price": 5.00,
        "quantity": 150,
        "status": "in_stock"
      }
    ],
    "reviews": [
      {
        "rating": 5,
        "reviewText": "Excellent service",
        "customerName": "Ahmed",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "status": "verified",
    "createdAt": "2023-06-01T00:00:00Z"
  }
}
```

#### 3.5.3 Get Available Areas (Public)
```http
GET /pharmacies/areas
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "name": "Downtown",
      "pharmacyCount": 8,
      "icon": "https://..."
    },
    {
      "name": "North District",
      "pharmacyCount": 5,
      "icon": "https://..."
    },
    {
      "name": "West End",
      "pharmacyCount": 3,
      "icon": "https://..."
    }
  ]
}
```

---

### 3.6 Inventory Endpoints (Pharmacy)

#### 3.6.1 Get My Inventory
```http
GET /inventory?page=1&per_page=20&sort=stock_low
Authorization: Bearer {token}
X-User-Role: pharmacy

Query Parameters:
- page: int
- per_page: int
- sort: enum [default, price_asc, price_desc, stock_low, stock_high, recent]
- status: enum [in_stock, low_stock, out_of_stock]

Response (200 OK):
{
  "success": true,
  "data": {
    "medicines": [
      {
        "id": 1,
        "medicineId": 1,
        "medicineName": "Panadol Extra (500mg)",
        "quantity": 150,
        "price": 5.00,
        "costPrice": 3.50,
        "minimumStock": 20,
        "maximumStock": 500,
        "status": "in_stock",
        "lastRestockDate": "2024-01-20T10:15:00Z",
        "expiryDate": "2025-12-31"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 3.6.2 Add Medicine to Inventory
```http
POST /inventory
Authorization: Bearer {token}
X-User-Role: pharmacy
Content-Type: application/json

Request Body:
{
  "medicineId": 1,
  "quantity": 100,
  "price": 5.00,
  "costPrice": 3.50,
  "minimumStock": 20,
  "maximumStock": 500,
  "expiryDate": "2025-12-31"
}

Response (201 Created):
{
  "success": true,
  "message": "Medicine added to inventory",
  "data": { ...inventory item }
}
```

#### 3.6.3 Update Inventory Item
```http
PUT /inventory/:inventoryId
Authorization: Bearer {token}
X-User-Role: pharmacy
Content-Type: application/json

Request Body:
{
  "quantity": 120,
  "price": 5.25,
  "costPrice": 3.50,
  "minimumStock": 15,
  "maximumStock": 600,
  "expiryDate": "2025-12-31"
}

Response (200 OK):
{
  "success": true,
  "message": "Inventory updated",
  "data": { ...updated item }
}
```

#### 3.6.4 Delete from Inventory
```http
DELETE /inventory/:inventoryId
Authorization: Bearer {token}
X-User-Role: pharmacy

Response (200 OK):
{
  "success": true,
  "message": "Item removed from inventory"
}
```

---

### 3.7 Orders Endpoints

#### 3.7.1 Submit Order (Citizen)
```http
POST /orders
Authorization: Bearer {token}
X-User-Role: citizen
Content-Type: application/json

Request Body:
{
  "pharmacyId": 2,
  "medicines": [
    {
      "medicineId": 1,
      "quantity": 2
    },
    {
      "medicineId": 3,
      "quantity": 1
    }
  ],
  "urgency": "standard",
  "notes": "Please pack carefully this is for elderly"
}

Response (201 Created):
{
  "success": true,
  "message": "Order submitted",
  "data": {
    "id": "ORD-1705305600000",
    "citizenId": 1,
    "pharmacyId": 2,
    "medicines": [
      {
        "medicineId": 1,
        "medicineName": "Panadol Extra",
        "quantity": 2,
        "unitPrice": 5.00,
        "subtotal": 10.00
      }
    ],
    "totalPrice": 10.00,
    "urgency": "standard",
    "status": "pending",
    "orderDate": "2024-01-15T10:30:00Z",
    "expectedDelivery": "2024-01-15T16:30:00Z"
  }
}
```

#### 3.7.2 Get My Orders (Citizen/Pharmacy)
```http
GET /orders?status=pending&page=1&per_page=10
Authorization: Bearer {token}

Query Parameters:
- status: enum [pending, approved, rejected, preparing, ready, delivered, cancelled]
- page: int
- per_page: int

Response (200 OK):
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-1705305600000",
        "orderType": "specific",
        "pharmacyName": "Al Shifa Pharmacy",
        "medicines": [...],
        "totalPrice": 10.00,
        "urgency": "standard",
        "status": "pending",
        "orderDate": "2024-01-15T10:30:00Z",
        "expectedDelivery": "2024-01-15T16:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 3.7.3 Get Order Details
```http
GET /orders/:orderId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "ORD-1705305600000",
    "citizenship": { id: 1, name: "Ahmed Ali" },
    "pharmacy": { id: 2, name: "Al Shifa" },
    "medicines": [...],
    "totalPrice": 10.00,
    "urgency": "standard",
    "notes": "Please pack carefully",
    "status": "approved",
    "statusTimeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:30:00Z",
        "notes": "Order received"
      },
      {
        "status": "approved",
        "timestamp": "2024-01-15T10:45:00Z",
        "notes": "Pharmacy approved"
      }
    ],
    "pharmacyResponse": "Will be ready in 30 min",
    "orderDate": "2024-01-15T10:30:00Z",
    "expectedDelivery": "2024-01-15T16:30:00Z"
  }
}
```

#### 3.7.4 Update Order Status (Pharmacy)
```http
PUT /orders/:orderId/status
Authorization: Bearer {token}
X-User-Role: pharmacy
Content-Type: application/json

Request Body:
{
  "status": "approved",
  "response": "Will be ready in 30 minutes"
}

Response (200 OK):
{
  "success": true,
  "message": "Order status updated",
  "data": { ...updated order }
}
```

#### 3.7.5 Cancel Order
```http
DELETE /orders/:orderId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Order cancelled"
}
```

---

### 3.8 Broadcast Requests Endpoints

#### 3.8.1 Create Broadcast Request (Citizen)
```http
POST /requests
Authorization: Bearer {token}
X-User-Role: citizen
Content-Type: application/json

Request Body:
{
  "medicineName": "Aspirin 500mg",
  "quantity": 5,
  "urgency": "urgent",
  "notes": "Need urgently for headache"
}

Response (201 Created):
{
  "success": true,
  "message": "Request broadcast to network",
  "data": {
    "id": "REQ-1705305600000",
    "medicineName": "Aspirin 500mg",
    "quantity": 5,
    "urgency": "urgent",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-01-15T12:30:00Z",
    "responses": []
  }
}
```

#### 3.8.2 Get My Broadcast Requests
```http
GET /requests?status=open&page=1
Authorization: Bearer {token}
X-User-Role: citizen

Response (200 OK):
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "REQ-1705305600000",
        "medicineName": "Aspirin 500mg",
        "quantity": 5,
        "urgency": "urgent",
        "status": "open",
        "responseCount": 3,
        "responses": [
          {
            "pharmacyId": 2,
            "pharmacyName": "Al Shifa Pharmacy",
            "price": 8.00,
            "quantity": 10,
            "responseTime": "2024-01-15T10:35:00Z"
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "expiresAt": "2024-01-15T12:30:00Z"
      }
    ]
  }
}
```

#### 3.8.3 Accept Pharmacy Response (Citizen)
```http
POST /requests/:requestId/accept/:pharmacyId
Authorization: Bearer {token}
X-User-Role: citizen

Response (200 OK):
{
  "success": true,
  "message": "Response accepted, order created",
  "data": {
    "requestId": "REQ-1705305600000",
    "orderId": "ORD-1705305700000",
    "pharmacyId": 2,
    "status": "accepted"
  }
}
```

#### 3.8.4 Get Network Requests (Pharmacy)
```http
GET /requests/network
Authorization: Bearer {token}
X-User-Role: pharmacy

Response (200 OK):
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "REQ-1705305600000",
        "citizenName": "Ahmed Ali",
        "medicineName": "Aspirin 500mg",
        "quantity": 5,
        "urgency": "urgent",
        "status": "open",
        "createdAt": "2024-01-15T10:30:00Z",
        "expiresAt": "2024-01-15T12:30:00Z"
      }
    ]
  }
}
```

#### 3.8.5 Submit Response to Request (Pharmacy)
```http
POST /requests/:requestId/respond
Authorization: Bearer {token}
X-User-Role: pharmacy
Content-Type: application/json

Request Body:
{
  "price": 8.00,
  "quantity": 10
}

Response (200 OK):
{
  "success": true,
  "message": "Response submitted",
  "data": {
    "requestId": "REQ-1705305600000",
    "pharmacyId": 2,
    "pharmacyName": "Al Shifa Pharmacy",
    "price": 8.00,
    "quantity": 10,
    "responseTime": "2024-01-15T10:35:00Z"
  }
}
```

---

### 3.9 Favorites Endpoints

#### 3.9.1 Add to Favorites
```http
POST /favorites
Authorization: Bearer {token}
X-User-Role: citizen
Content-Type: application/json

Request Body:
{
  "type": "medicine",  // or "pharmacy"
  "targetId": 1,
  "targetData": {
    "name": "Panadol Extra",
    "category": "Pain Relief",
    "price": 5.00
  }
}

Response (201 Created):
{
  "success": true,
  "message": "Added to favorites",
  "data": { ...favorite object }
}
```

#### 3.9.2 Get My Favorites
```http
GET /favorites?type=medicine&page=1
Authorization: Bearer {token}
X-User-Role: citizen

Query Parameters:
- type: enum [medicine, pharmacy, all]
- page: int

Response (200 OK):
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": 1,
        "type": "medicine",
        "targetId": 1,
        "targetData": {
          "name": "Panadol Extra",
          "category": "Pain Relief",
          "price": 5.00
        },
        "addedAt": "2024-01-10T00:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### 3.9.3 Remove from Favorites
```http
DELETE /favorites/:favoriteId
Authorization: Bearer {token}
X-User-Role: citizen

Response (200 OK):
{
  "success": true,
  "message": "Removed from favorites"
}
```

---

### 3.10 Reviews Endpoints

#### 3.10.1 Submit Review
```http
POST /reviews
Authorization: Bearer {token}
X-User-Role: citizen
Content-Type: application/json

Request Body:
{
  "pharmacyId": 2,
  "rating": 4.9,
  "reviewText": "Excellent service, fast delivery"
}

Response (201 Created):
{
  "success": true,
  "message": "Review submitted",
  "data": {
    "id": 1,
    "pharmacyId": 2,
    "rating": 4.9,
    "reviewText": "Excellent service, fast delivery",
    "createdAt": "2024-01-15T16:30:00Z"
  }
}
```

#### 3.10.2 Get Reviews for Pharmacy
```http
GET /reviews/pharmacy/:pharmacyId?page=1
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 4.9,
        "reviewText": "Excellent service",
        "customerName": "Ahmed",
        "createdAt": "2024-01-15T16:30:00Z"
      }
    ],
    "averageRating": 4.8,
    "totalReviews": 120,
    "pagination": { ... }
  }
}
```

---

### 3.11 Complaints Endpoints

#### 3.11.1 Submit Complaint (Citizen)
```http
POST /complaints
Authorization: Bearer {token}
X-User-Role: citizen
Content-Type: application/json

Request Body:
{
  "againstPharmacyId": 2,
  "subject": "Wrong medicine received",
  "details": "I ordered Panadol but received Aspirin instead",
  "severity": "high"
}

Response (201 Created):
{
  "success": true,
  "message": "Complaint submitted",
  "data": {
    "id": "CP-1705305600000",
    "againstPharmacyId": 2,
    "subject": "Wrong medicine received",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3.11.2 Get My Complaints
```http
GET /complaints?status=open&page=1
Authorization: Bearer {token}
X-User-Role: citizen

Response (200 OK):
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "CP-1705305600000",
        "againstPharmacy": {
          "id": 2,
          "name": "Al Shifa Pharmacy"
        },
        "subject": "Wrong medicine received",
        "severity": "high",
        "status": "open",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 3.11.3 Get Complaints Against Pharmacy (Admin)
```http
GET /admin/complaints?status=open&page=1
Authorization: Bearer {token}
X-User-Role: admin

Response (200 OK):
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "CP-1705305600000",
        "reporter": { id: 1, name: "Ahmed" },
        "againstPharmacy": { id: 2, name: "Al Shifa" },
        "subject": "Wrong medicine received",
        "severity": "high",
        "status": "open",
        "assignedAdmin": null,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 3.11.4 Resolve Complaint (Admin)
```http
PUT /admin/complaints/:complaintId
Authorization: Bearer {token}
X-User-Role: admin
Content-Type: application/json

Request Body:
{
  "status": "resolved",
  "resolution": "Pharmacy refunded the customer $8.00"
}

Response (200 OK):
{
  "success": true,
  "message": "Complaint resolved",
  "data": { ...updated complaint }
}
```

---

### 3.12 Admin Endpoints

#### 3.12.1 Get All Users
```http
GET /admin/users?role=citizen&status=active&page=1
Authorization: Bearer {token}
X-User-Role: admin

Query Parameters:
- role: enum [citizen, pharmacy]
- status: enum [active, inactive, suspended]
- page: int

Response (200 OK):
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Ahmed Ali",
        "email": "ahmed@example.com",
        "role": "citizen",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 3.12.2 Get Pharmacy Verification Requests
```http
GET /admin/pharmacies/verification?status=pending&page=1
Authorization: Bearer {token}
X-User-Role: admin

Response (200 OK):
{
  "success": true,
  "data": {
    "pharmacies": [
      {
        "id": 2,
        "name": "Al Shifa Pharmacy",
        "licenseNumber": "PH-2024-001",
        "licenseExpiry": "2025-06-30",
        "status": "pending",
        "submittedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 3.12.3 Verify/Reject Pharmacy
```http
PUT /admin/pharmacies/:pharmacyId/verify
Authorization: Bearer {token}
X-User-Role: admin
Content-Type: application/json

Request Body:
{
  "status": "verified",  // or "rejected"
  "notes": "License verified and valid"
}

Response (200 OK):
{
  "success": true,
  "message": "Pharmacy status updated",
  "data": { ...updated pharmacy }
}
```

#### 3.12.4 Get System Statistics
```http
GET /admin/statistics
Authorization: Bearer {token}
X-User-Role: admin

Response (200 OK):
{
  "success": true,
  "data": {
    "totalCitizens": 1250,
    "totalPharmacies": 85,
    "totalMedicines": 550,
    "totalOrders": 45230,
    "totalRevenue": 234567.89,
    "topMedicines": [...],
    "recentComplaints": 12,
    "averageOrderValue": 45.50,
    "monthlyGrowth": 15.3
  }
}
```

#### 3.12.5 Get Reports
```http
GET /admin/reports?type=shortage&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
X-User-Role: admin

Query Parameters:
- type: enum [shortage, complaints, orders, pharmacy_performance]
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD

Response (200 OK):
{
  "success": true,
  "data": {
    "reportType": "shortage",
    "period": "2024-01-01 to 2024-01-31",
    "items": [
      {
        "medicineName": "Panadol Extra",
        "category": "Pain Relief",
        "shortagesCount": 15,
        "affectedPharmacies": 8
      }
    ]
  }
}
```

---

## Part 4️⃣: Authentication & Authorization

### 4.1 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "id": 1,
    "email": "ahmed@example.com",
    "role": "citizen",
    "permissions": ["read_medicines", "submit_orders"],
    "iat": 1705305600,
    "exp": 1705392000,
    "iss": "medlink.api"
  }
}
```

### 4.2 Role-Based Access Control (RBAC)

| Endpoint | Citizen | Pharmacy | Admin |
|----------|---------|----------|-------|
| GET /medicines | ✅ | ✅ | ✅ |
| POST /orders | ✅ | ❌ | ❌ |
| GET /orders | ✅ | ✅ | ✅ |
| PUT /orders/:id/status | ❌ | ✅ | ✅ |
| POST /inventory | ❌ | ✅ | ❌ |
| GET /inventory | ❌ | ✅ | ❌ |
| POST /requests | ✅ | ❌ | ❌ |
| POST /requests/:id/respond | ❌ | ✅ | ❌ |
| POST /complaints | ✅ | ❌ | ❌ |
| GET /admin/* | ❌ | ❌ | ✅ |

### 4.3 Frontend Implementation Strategy

**Update `login.js`:**
```javascript
// Replace email-based role detection with API-based authentication
const response = await fetch('https://api.medlink.com/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('medlink_token', data.data.token);
localStorage.setItem('medlink_user_role', data.data.role);
localStorage.setItem('medlink_user_id', data.data.id);
```

**Add API Wrapper:**
```javascript
// Create a new file: frontend/js/api-client.js
const APIClient = {
  baseURL: 'https://api.medlink.com/api/v1',
  
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('medlink_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    return response.json();
  },

  // Convenience methods
  get(endpoint) { return this.request('GET', endpoint); },
  post(endpoint, body) { return this.request('POST', endpoint, body); },
  put(endpoint, body) { return this.request('PUT', endpoint, body); },
  delete(endpoint) { return this.request('DELETE', endpoint); }
};
```

---

## Part 5️⃣: Implementation Phases & Priority

### Phase 1️⃣: Foundation (Week 1-2)
**Priority: CRITICAL**

- [ ] Setup Laravel project & database
- [ ] Implement authentication endpoints (register, login, logout)
- [ ] Create database migrations for User models
- [ ] Implement JWT token generation
- [ ] Create User Profile endpoints
- [ ] Setup middleware for RBAC

**Deliverable:** Working authentication system

---

### Phase 2️⃣: Core Business Logic (Week 3-4)
**Priority: HIGH**

- [ ] Implement Medicines endpoints (list, search, filter)
- [ ] Implement Pharmacy endpoints (list, details, areas)
- [ ] Implement Categories endpoints
- [ ] Create Pharmacy Inventory management endpoints
- [ ] Setup database for medicines and inventory

**Deliverable:** Core search and inventory functionality

---

### Phase 3️⃣: Orders & Transactions (Week 5-6)
**Priority: HIGH**

- [ ] Implement Orders endpoints (submit, list, update status)
- [ ] Implement Broadcast Requests endpoints
- [ ] Create order status tracking logic
- [ ] Implement payment integration (optional: Phase 2)

**Deliverable:** Complete order management system

---

### Phase 4️⃣: User Features (Week 7)
**Priority: MEDIUM**

- [ ] Implement Favorites endpoints
- [ ] Implement Reviews endpoints
- [ ] Implement Complaints endpoints
- [ ] Add notifications system (optional)

**Deliverable:** Enhanced user experience with favorites, reviews, complaints

---

### Phase 5️⃣: Admin Dashboard (Week 8)
**Priority: MEDIUM**

- [ ] Implement Admin User Management endpoints
- [ ] Implement Pharmacy Verification endpoints
- [ ] Implement Reports & Statistics endpoints
- [ ] Create complaint resolution workflow

**Deliverable:** Full admin control panel

---

### Phase 6️⃣: Frontend Integration (Week 9-10)
**Priority: HIGH**

- [ ] Update all frontend JS files to use API Client
- [ ] Remove LocalStorage dependencies
- [ ] Update data models in frontend
- [ ] Add error handling and loading states
- [ ] Implement token refresh logic

**Deliverable:** Fully integrated Frontend + Backend

---

## Part 6️⃣: Technical Requirements

### 6.1 Laravel Project Setup

```bash
# Create new Laravel project
composer create-project laravel/laravel medlink-api

# Key packages to install
composer require tymon/jwt-auth
composer require barryvdh/laravel-cors
composer require doctrine/dbal
composer require guzzlehttp/guzzle
```

### 6.2 Environment Configuration

```env
# .env file
APP_NAME="MedLink API"
APP_ENV=production
APP_KEY=base64:xxxxx
APP_DEBUG=false
APP_URL=https://api.medlink.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=medlink_db
DB_USERNAME=medlink_user
DB_PASSWORD=xxxxx

JWT_SECRET=your_secret_key
JWT_TTL=1440  # Token expires in 1 day
```

### 6.3 Database Configuration

```

sql
-- MySQL 8.0+
-- Create database
CREATE DATABASE medlink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medlink_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON medlink_db.* TO 'medlink_user'@'localhost';
FLUSH PRIVILEGES;
```

### 6.4 Key Controllers to Create

```
app/Http/Controllers/
├── AuthController.php             # Authentication
├── UserController.php              # User management
├── MedicineController.php           # Medicine management
├── PharmacyController.php           # Pharmacy management
├── InventoryController.php          # Inventory management
├── OrderController.php              # Order management
├── BroadcastRequestController.php   # Broadcast requests
├── FavoriteController.php           # Favorites
├── ReviewController.php             # Reviews
├── ComplaintController.php          # Complaints
├── Admin/
│   ├── UserManagementController.php
│   ├── PharmacyVerificationController.php
│   ├── ReportController.php
│   └── StatisticsController.php
└── NotificationController.php       # Notifications (optional)
```

### 6.5 Key Models to Create

```php
// app/Models/
- User.php (with role: citizen, pharmacy, admin)
- Medicine.php
- Pharmacy.php (extends User)
- Citizen.php (extends User)
- InventoryItem.php
- Order.php
- BroadcastRequest.php
- Complaint.php
- Review.php
- Favorite.php
- Category.php
```

### 6.6 Security Considerations

1. **Password Hashing:** Use `bcrypt()` for all passwords
2. **CORS:** Configure CORS for frontend domain
3. **Rate Limiting:** Implement rate limiting on auth endpoints
4. **Input Validation:** Validate all user inputs
5. **SQL Injection:** Use parameterized queries (Laravel Eloquent)
6. **XSS Protection:** Sanitize outputs
7. **HTTPS Only:** Force HTTPS in production
8. **API Versioning:** Use `/api/v1/` prefix for future compatibility
9. **Audit Logging:** Log all critical operations

---

## Part 7️⃣: Frontend Integration Checklist

### 7.1 Files to Modify

```
frontend/js/
├── [ ] login.js - Use API instead of localStorage
├── [ ] register.js - Use API instead of localStorage
├── [ ] api-client.js - CREATE NEW (API wrapper)
├── [ ] citizen-dashboard.js - Replace data-engine with API calls
├── [ ] pharmacy'Dashboard.js - Replace localStorage with API
├── [ ] admin-dashboard.js - Replace localStorage with API
├── [ ] data-engine.js - Keep for UI logic, remove storage logic
├── [ ] orders-engine.js - Replace with order-api.js
├── [ ] medlink-ui.js - Keep as-is (UI helpers)
└── [ ] home.js - Update navigation based on token
```

### 7.2 Data Flow Changes

```
BEFORE (Current - LocalStorage):
User Action → JavaScript → LocalStorage → HTML Rendered

AFTER (With API):
User Action → JavaScript → API Call → Database → API Response → HTML Rendered
```

### 7.3 Token Management

```javascript
// frontend/js/token-manager.js (NEW FILE)
const TokenManager = {
  setToken(token) {
    localStorage.setItem('medlink_token', token);
    localStorag.setItem('medlink_token_expires', Date.now() + 86400000);
  },

  getToken() {
    const token = localStorage.getItem('medlink_token');
    const expires = localStorage.getItem('medlink_token_expires');
    
    if (Date.now() > expires) {
      this.refreshToken();
    }
    return token;
  },

  async refreshToken() {
    const response = await APIClient.post('/auth/refresh');
    if (response.success) {
      this.setToken(response.data.token);
    } else {
      this.logout();
    }
  },

  logout() {
    localStorage.removeItem('medlink_token');
    localStorage.removeItem('medlink_user_role');
    window.location.href = '../auth/login.html';
  }
};
```

---

## Part 8️⃣: Error Handling Strategy

### 8.1 API Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"],
    "password": ["Password must be at least 8 characters"]
  },
  "code": 422
}
```

### 8.2 Frontend Error Handling

```javascript
async function apiCall(method, endpoint, body = null) {
  try {
    const response = await APIClient[method](endpoint, body);

    if (!response.success) {
      if (response.code === 401) {
        // Unauthorized - redirect to login
        TokenManager.logout();
      } else if (response.code === 422) {
        // Validation error
        MedLinkUI.toast(response.message, 'error');
      } else if (response.code === 500) {
        // Server error
        MedLinkUI.toast('Server error. Please try again later', 'error');
      }
      return null;
    }

    return response.data;
  } catch (error) {
    MedLinkUI.toast('Network error. Check your connection', 'error');
    return null;
  }
}
```

---

## Part 9️⃣: Testing Strategy

### 9.1 API Endpoints Testing

Use Postman or Insomnia to test:
- [ ] Create test collection for all endpoints
- [ ] Test with different user roles
- [ ] Test error scenarios
- [ ] Test pagination
- [ ] Test filtering and sorting

### 9.2 Frontend Testing

- [ ] Test API integration with each page
- [ ] Test token refresh
- [ ] Test logout and re-login
- [ ] Test error toast notifications
- [ ] Test loading states

### 9.3 Load Testing

- [ ] Test with 1000+ concurrent users
- [ ] Monitor database query performance
- [ ] Test API response times

---

## 🎯 Summary: What Backend Developers Need to Know

1. **Database Models** - 12 models with specific relationships (Part 2)
2. **API Endpoints** - 50+ RESTful endpoints (Part 3)
3. **Authentication** - JWT-based with role-based access control (Part 4)
4. **Implementation Priority** - 6 phases over 10 weeks (Part 5)
5. **Frontend Integration** - How frontend will call your APIs (Part 7)
6. **Error Handling** - Standardized error response format (Part 8)

---

## 📞 Contact & Support

**Project Lead:** Alaa Eliwa
**Repository:** https://github.com/alaaeliwa/medlink
**API Documentation:** (Will be hosted on Postman/Swagger UI)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-25 | Initial backend roadmap for Laravel developers |

