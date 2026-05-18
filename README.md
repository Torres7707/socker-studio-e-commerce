# Socker Studio - Nordic Style E-commerce

A modern full-stack e-commerce application with Nordic minimalist design, built with React + TypeScript + Vite + Node.js + Fastify.

> 📖 Other Languages: [中文](./README_CN.md)

## ✨ Project Features

- 🎨 **Nordic Minimalist Design** - Clean and elegant user interface
- ⚡ **Ultimate Performance** - Vite build with instant hot updates
- 🔐 **Complete Authentication** - Firebase + JWT dual authentication system
- 🛒 **Shopping Experience** - Complete flow from browsing to checkout
- 📱 **Responsive Design** - Perfect adaptation for mobile and desktop
- ✅ **Test Coverage** - 99 test cases with 100% pass rate
- 🗄️ **Full-Stack Architecture** - Frontend + Backend + Database complete solution

## 🚀 Core Features

### User System
- ✅ User registration/login (Email, Google, GitHub)
- ✅ OAuth login with repeat access support (POST /auth/oauth)
- ✅ Profile management (connected to backend API)
- ✅ Shipping address management (CRUD via API)
- ✅ Order history viewing (real data from API)

### Product System
- ✅ Product listing display
- ✅ Multi-dimensional filtering (price, rating, multi-category)
- ✅ Server-side filtering (no client-side double-filter)
- ✅ Search functionality (history, popular recommendations)
- ✅ Product detail page
- ✅ Product review system

### Shopping System
- ✅ Shopping cart management
- ✅ Favorites functionality (synced with server)
- ✅ Checkout process
- ✅ Order tracking (real data from API)

### UI Experience
- ✅ Shared Layout component (consistent header across all pages)
- ✅ Toast notification system
- ✅ Loading state management
- ✅ Error handling
- ✅ Smooth animation transitions

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Routing**: React Router 7
- **Auth**: Firebase Auth + JWT
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **API**: RESTful API

### Testing
- **Framework**: Vitest
- **Component Testing**: @testing-library/react
- **User Interaction**: @testing-library/user-event

### Development Tools
- **Package Manager**: pnpm
- **Code Linting**: ESLint
- **Type Checking**: TypeScript

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── toast.tsx
│   │   ├── Login.tsx      # Login component
│   │   └── Layout.tsx     # Shared layout with header
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Home page
│   │   ├── ProductDetail.tsx # Product detail
│   │   ├── Cart.tsx       # Shopping cart
│   │   ├── Checkout.tsx   # Checkout
│   │   ├── Profile.tsx    # User profile
│   │   ├── Favorites.tsx  # Favorites
│   │   └── OrderTracking.tsx # Order tracking
│   ├── store/             # State management
│   │   ├── authStore.ts   # Auth state
│   │   ├── cartStore.ts   # Cart state
│   │   ├── favoritesStore.ts # Favorites state
│   │   ├── filterStore.ts # Filter state
│   │   └── reviewStore.ts # Review state
│   ├── lib/               # Utilities
│   │   ├── firebase.ts    # Firebase config
│   │   ├── api.ts         # API client
│   │   └── utils.ts       # Utility functions
│   └── test/              # Test config
│       └── setup.ts
├── backend/               # Backend source code
│   ├── src/
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts    # Authentication
│   │   │   ├── products.ts # Products
│   │   │   ├── orders.ts  # Orders
│   │   │   ├── users.ts   # Users
│   │   │   ├── cart.ts    # Shopping cart
│   │   │   └── favorites.ts # Favorites
│   │   ├── utils/         # Utilities
│   │   │   └── prisma.ts  # Prisma client
│   │   ├── schemas/       # Validation schemas
│   │   ├── seed.ts        # Database seed
│   │   └── index.ts       # Entry point
│   └── prisma/
│       └── schema.prisma  # Database schema
```

## 🚦 Quick Start

### Requirements
- Node.js 18+
- PostgreSQL 16+
- pnpm (recommended)

### Install Dependencies
```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend && pnpm install
```

### Configure Environment Variables
```bash
# Frontend
cp .env.example .env
# Edit .env file with your Firebase configuration

# Backend
cd backend && cp .env.example .env
# Edit .env file with your database configuration
```

### Database Setup
```bash
cd backend

# Run database migrations
npx prisma migrate dev

# Seed database with sample data
pnpm prisma:seed
```

### Start Development Server
```bash
# Start backend (in backend directory)
pnpm dev

# Start frontend (in root directory)
pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Build for Production
```bash
pnpm build
```

### Run Tests
```bash
# Run tests (watch mode)
pnpm test

# Run tests (single run)
pnpm test:run

# View test coverage
pnpm test:coverage
```

## 📊 Test Coverage

The project includes **99 test cases** covering all core functionality:

```
✓ src/store/filterStore.test.ts (20 tests)
✓ src/lib/utils.test.ts (4 tests)
✓ src/store/reviewStore.test.ts (15 tests)
✓ src/store/favoritesStore.test.ts (12 tests)
✓ src/components/ui/button.test.tsx (6 tests)
✓ src/components/ui/input.test.tsx (21 tests)
✓ src/store/cartStore.test.ts (11 tests)
✓ src/store/authStore.test.ts (10 tests)

Test Files  8 passed (8)
Tests  99 passed (99)
```

## 🎯 Future Plans

### Frontend Enhancement
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] PWA support (offline access, push notifications)
- [ ] Internationalization (multi-language support)
- [ ] Accessibility optimization
- [ ] Skeleton screen loading
- [ ] Product comparison feature
- [ ] Coupon system

### Full-Stack Transformation
- [x] Backend API development (Node.js + Fastify) ✅
- [x] Database design (PostgreSQL + Prisma) ✅
- [x] OAuth login with repeat access (POST /auth/oauth) ✅
- [x] Shared Layout component ✅
- [x] Codebase cleanup and .env.example ✅
- [ ] Payment integration (Stripe)
- [ ] Email service (SendGrid)
- [ ] File storage (AWS S3/Cloudinary)
- [ ] Admin dashboard
- [ ] Deployment and operations (Vercel + Railway)

### Advanced Features
- [ ] Smart recommendation algorithm
- [ ] Real-time inventory updates
- [ ] Price change notifications
- [ ] Social sharing
- [ ] Review image upload

## 📝 Development Log

### 2026-05-18
- ✅ Fixed OAuth repeat login (new POST /auth/oauth endpoint with find-or-create)
- ✅ Fixed Home page double-filtering (backend now supports multi-category via comma-separated param)
- ✅ Connected Profile page to real backend API (addresses, orders, profile save)
- ✅ Connected Order Tracking to real backend API (removed all mock data)
- ✅ Extracted shared Layout component (consistent header across all pages)
- ✅ Cleaned up unused files (WebLogin.tsx, next-themes, data/products.ts)
- ✅ Renamed package from "my-react-ts-app" to "socker-studio"
- ✅ Added backend .env.example for easier onboarding
- ✅ Fixed rolldown parser error with nested ternary JSX pattern

### 2026-03-28
- ✅ Completed Phase 4 backend API development
- ✅ Set up Node.js + Fastify backend architecture
- ✅ Implemented PostgreSQL database with Prisma ORM
- ✅ Created complete RESTful API (auth, products, orders, cart, favorites)
- ✅ Added database seed data (12 products, 2 users, reviews)
- ✅ Integrated frontend with backend API

### 2026-03-27
- ✅ Completed core e-commerce functionality
- ✅ Implemented complete test coverage (99 tests)
- ✅ Added order tracking feature
- ✅ Optimized filtering and search
- ✅ Improved user authentication flow

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

MIT License

## 🔗 Related Links

- [Development Plan](./TODO.md)
- [中文文档](./README_CN.md)
- [中文开发计划](./TODO_CN.md)

---

**Socker Studio** - Making shopping experience more elegant 🛍️