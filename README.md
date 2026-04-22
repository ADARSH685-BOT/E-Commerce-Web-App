<div align="center">

# 🛍️ LUXÉRA
### Premium E-Commerce Web Application

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-EF008F?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

> **A fully frontend, zero-backend premium shopping experience — built with React, Redux Toolkit, and Tailwind CSS.**
> No API. No server. Just pure React magic. ✨

<br/>

![LUXÉRA Preview](https://via.placeholder.com/900x420/1a1a1a/c9a84c?text=LUXÉRA+—+Premium+Shopping+Experience)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/ADARSH685-BOT/luxera?style=social)](https://github.com/ADARSH685-BOT/luxera/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ADARSH685-BOT/luxera?style=social)](https://github.com/ADARSH685-BOT/luxera/network)
[![GitHub issues](https://img.shields.io/github/issues/ADARSH685-BOT/luxera?color=red)](https://github.com/ADARSH685-BOT/luxera/issues)

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🖥️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📄 Pages Overview](#-pages-overview)
- [🎨 Design System](#-design-system)
- [🔐 How Auth Works](#-how-authentication-works)
- [🌐 Deployment](#-deployment)
- [👨‍💻 Author](#-author)

---

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog** — 30+ products across 5 categories with grid/list view toggle
- **Advanced Filters** — Filter by category, brand, price range, rating & availability
- **Smart Search** — Debounced real-time search with live suggestions dropdown
- **Product Detail** — Image gallery with zoom, size/color selector, quantity picker
- **Quick View Modal** — Preview products without leaving the current page
- **Related Products** — Cross-sell recommendations on every product page

### 🧺 Cart & Checkout
- **Persistent Cart** — Survives page refresh via Redux Persist + localStorage
- **Promo Codes** — Coupon/discount code input support
- **Multi-Step Checkout** — Address → Payment → Review → Confirmation
- **Payment UI** — Credit Card, UPI, and Cash on Delivery (UI only, no real processing)
- **Order History** — All orders saved locally per user

### 🔐 Authentication (Pure Frontend — No Backend)
- **Register / Login** — User credentials saved to localStorage, zero server needed
- **Persistent Session** — Stays logged in across page refreshes automatically
- **Protected Routes** — Cart, Checkout, Profile & Wishlist require login
- **Profile Dashboard** — Edit info, view order history, manage addresses

### 💖 Wishlist
- Add/remove products with animated heart toggle
- Wishlist count badge in navbar
- Move items directly from wishlist to cart

### 🎨 UI & Design
- **Luxury Minimal Aesthetic** — Playfair Display + DM Sans typography
- **Dark Mode** — Toggle persisted in localStorage
- **Smooth Animations** — Page transitions & micro-interactions via Framer Motion
- **Skeleton Loaders** — On all data-rendered sections
- **Toast Notifications** — For every user action (add, remove, login, etc.)
- **Fully Responsive** — Mobile-first, works on 320px to 4K screens

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ Framework | React 18 (Functional Components + Hooks) |
| ⚡ Build Tool | Vite |
| 🗺️ Routing | React Router v6 |
| 🗃️ State Management | Redux Toolkit + Redux Persist |
| 🎨 Styling | Tailwind CSS (custom theme) |
| 🎞️ Animations | Framer Motion |
| 📋 Forms | React Hook Form + Yup |
| 🔔 Notifications | React Hot Toast |
| 🔣 Icons | Lucide React |
| 🗄️ Data | Static JSON files (zero API calls) |
| 💾 Storage | localStorage (auth, cart, wishlist, orders) |

---

## 📁 Project Structure

```
luxera/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── StarRating.jsx
│   │   ├── QuickViewModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Breadcrumb.jsx
│   │   └── BackToTop.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Search.jsx
│   │   └── NotFound.jsx
│   ├── store/
│   │   ├── store.js
│   │   ├── cartSlice.js
│   │   ├── wishlistSlice.js
│   │   ├── authSlice.js
│   │   └── filterSlice.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useCart.js
│   │   ├── useWishlist.js
│   │   └── useAuth.js
│   ├── utils/
│   │   ├── formatPrice.js
│   │   ├── calculateDiscount.js
│   │   └── validators.js
│   ├── data/
│   │   ├── products.json
│   │   ├── categories.json
│   │   └── reviews.json
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/ADARSH685-BOT/luxera.git
cd luxera
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

**4. Open in browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

### Install All Dependencies (One Command)
```bash
npm install react react-dom react-router-dom @reduxjs/toolkit react-redux redux-persist react-hook-form @hookform/resolvers yup react-hot-toast framer-motion lucide-react react-helmet-async
```

---

## 📄 Pages Overview

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home | ❌ |
| `/products` | Product Listing | ❌ |
| `/products/:id` | Product Detail | ❌ |
| `/search` | Search Results | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/cart` | Shopping Cart | ✅ |
| `/checkout` | Checkout | ✅ |
| `/profile` | User Profile | ✅ |
| `/wishlist` | Wishlist | ✅ |
| `*` | 404 Not Found | ❌ |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Display Font | Playfair Display |
| Body Font | DM Sans |
| Charcoal (Primary) | `#1a1a1a` |
| Cream (Background) | `#fafaf8` |
| Gold (Accent) | `#c9a84c` |

---

## 🔐 How Authentication Works

> This project has **zero backend**. Auth is simulated entirely in the browser using localStorage.

| Step | Action |
|---|---|
| 📝 Register | Saves user object into `localStorage['users']` array |
| 🔑 Login | Matches email + password against stored users |
| 💾 Session | `localStorage['currentUser']` is read on every app load |
| 🚪 Logout | Clears `currentUser` from localStorage |
| 🛡️ Protected Routes | Redirects to `/login` if `currentUser` is null |

---

## 🌐 Deployment

### ▲ Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### 🌍 Deploy to Netlify
```bash
npm run build
# Drag and drop the /dist folder to netlify.com/drop
```

### 📄 Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Adarsh Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-ADARSH685--BOT-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ADARSH685-BOT)

---

⭐ **If you found this project helpful, please give it a star!** ⭐

<br/>

Made with ❤️ and lots of ☕ by [Adarsh Kumar](https://github.com/ADARSH685-BOT)

</div>
