# 🏥 MedLink

### Your integrated premium platform to find and reserve medicines easily and quickly.

[![Version](https://img.shields.io/badge/version-2.0.0--Premium-blueviolet?style=for-the-badge)](https://github.com/alaaeliwa/medlink)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla--HTML/CSS/JS-orange?style=for-the-badge)](frontend/)

![MedLink Logo](frontend/images/logo.png)

---

## 🌟 Overview
**MedLink** is a state-of-the-art web platform (part of the Distributed and Parallel Computing Laboratory - DS) designed to bridge the gap between patients and pharmacies. The platform solves the problem of manual and exhausting searches for medicines by providing a digitized, real-time marketplace.

## ✨ Premium UI/UX Experience (v2.0)
The platform has undergone a major aesthetic overhaul to provide a **Premium Enterprise Experience**:
- 🪟 **Glassmorphism Design**: Sleek, transparent UI elements with blur effects.
- 🦄 **Bounce Animations**: Smooth, fluid micro-interactions for a lifelike feel.
- 🔔 **Intelligent Toasts**: Non-blocking notifications with visual progress bars.
- 🔓 **Graceful Logout**: Secure, confirmation-based logout flow using premium modal systems.

---

## 🚀 Key Features

### 👨‍👩‍👧‍👦 For Citizens
- **Smart Search:** Advanced engine with fuzzy matching for names or active ingredients.
- **Dynamic Inventory:** Instantly see nearby availability with live filtering and sorting.
- **Request Network:** Broadcast search requests to the entire pharmacy network when stock is not found.
- **Favorites System:** One-click tracking for preferred medicines and trusted pharmacies.

### 💊 For Pharmacies
- **Full Inventory Suite:** Comprehensive dashboard to manage stock levels, pricing, and descriptions.
- **Order Management:** Real-time tracking of customer requests with status-based workflows (Pending, Approved, Ready).
- **Profile Customization:** Highly customizable business profile including delivery status and location.

### 🛡️ For Administrators
- **Verified Network:** Centralized control over pharmacy licenses and system access.
- **Data Insights:** Oversight of medicine shortage reports and regional health trends.

---

## 🛠️ Technology Stack
- **Architecture:** Modular multi-directory structure for enhanced maintainability.
- **Styling:** Vanilla CSS3 with CSS Variables, Flexbox, and Grid Systems.
- **Logic:** Vanilla ES6+ JavaScript handling all state and dynamic UI rendering.
- **Icons:** [Font Awesome 6.5.0](https://fontawesome.com/)
- **Typography:** [Outfit](https://fonts.google.com/specimen/Outfit) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.

---

## 📂 Project Structure

```text
medlink-DS/
├── frontend/                  # Modernized UI & Logic
│   ├── index.html            # Unified Landing Page
│   ├── auth/                 # Authentication (Login/Register)
│   ├── citizen/              # Citizen Dashboards & Search
│   ├── pharmacy/             # Pharmacy Inventory & Orders
│   ├── admin/                # Administrative Controls (Ready)
│   ├── js/                   # Global Data Engine & UI Helpers
│   ├── css/                  # Global & Component Styles
│   └── images/               # Branding Assets & Media
├── backend/                  # (Coming Soon) API Layer
├── database/                 # (Coming Soon) Schema Definitions
├── docs/                     # Technical Reports & Planning
└── README.md                 # Main Documentation
```

---

## 🏁 Getting Started

To explore the MedLink prototype:
1. Clone or download the repository.
2. Navigate to the `frontend/` directory.
3. Launch `index.html` in your favorite modern browser.

> [!IMPORTANT]
> This platform uses **LocalStorage** to simulate a persistent data experience across different roles. For the best experience, ensure your browser cookies/storage are enabled.

---

> **🏆 Credits:** Developed by **Alaa Eliwa** and team for the Distributed and Parallel Computing Laboratory.
