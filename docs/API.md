# Socker Studio API Documentation

> 📖 Base URL: `http://localhost:3001/api`

## 📋 Table of Contents

- [Authentication](#-authentication)
- [Products](#-products)
- [Cart](#-cart)
- [Orders](#-orders)
- [Users](#-users)
- [Favorites](#-favorites)
- [Health Check](#-health-check)
- [Data Models](#-data-models)

---

## 🔐 Authentication

### Register

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "name": "string",
    "photoURL": "string | null",
    "provider": "credentials",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

**Error Response (400):**
```json
{
  "error": "User already exists",
  "message": "A user with this email or username already exists"
}
```

---

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "name": "string",
    "photoURL": "string | null",
    "provider": "string",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials",
  "message": "Username or password is incorrect"
}
```

---

### Logout

```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Refresh Token

```http
POST /api/auth/refresh-token
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "token": "string"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid token",
  "message": "Token is invalid or expired"
}
```

---

### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

---

## 📦 Products

### Get Products

```http
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `category` | string | Filter by category |
| `search` | string | Search in name and description |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `minRating` | number | Minimum rating filter |
| `sortBy` | string | Sort order: `price-asc`, `price-desc`, `rating`, `newest` |

**Example:**
```http
GET /api/products?page=1&limit=10&category=Furniture&sortBy=price-asc
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 189,
      "originalPrice": 229,
      "image": "string",
      "category": "string",
      "rating": 4.8,
      "reviews": 124,
      "inStock": true,
      "createdAt": "datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### Get Product by ID

```http
GET /api/products/:id
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 189,
  "originalPrice": 229,
  "image": "string",
  "category": "string",
  "rating": 4.8,
  "reviews": 124,
  "inStock": true,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "reviewsList": [
    {
      "id": "string",
      "productId": "string",
      "userId": "string",
      "userName": "string",
      "rating": 5,
      "comment": "string",
      "helpful": 10,
      "createdAt": "datetime"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Product not found",
  "message": "Product with the specified ID does not exist"
}
```

---

### Get Product Reviews

```http
GET /api/products/:id/reviews
```

**Response (200):**
```json
[
  {
    "id": "string",
    "productId": "string",
    "userId": "string",
    "userName": "string",
    "rating": 5,
    "comment": "string",
    "helpful": 10,
    "createdAt": "datetime",
    "user": {
      "name": "string"
    }
  }
]
```

---

### Add Review

```http
POST /api/products/:id/reviews
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

**Response (201):**
```json
{
  "id": "string",
  "productId": "string",
  "userId": "string",
  "userName": "string",
  "rating": 5,
  "comment": "Great product!",
  "helpful": 0,
  "createdAt": "datetime"
}
```

---

### Mark Review as Helpful

```http
POST /api/products/:id/reviews/:reviewId/helpful
```

**Response (200):**
```json
{
  "id": "string",
  "productId": "string",
  "userId": "string",
  "userName": "string",
  "rating": 5,
  "comment": "string",
  "helpful": 11,
  "createdAt": "datetime"
}
```

---

## 🛒 Cart

### Get Cart

```http
GET /api/cart
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "productId": "string",
    "quantity": 2,
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "product": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 189,
      "originalPrice": 229,
      "image": "string",
      "category": "string",
      "rating": 4.8,
      "reviews": 124,
      "inStock": true
    }
  }
]
```

---

### Add to Cart

```http
POST /api/cart
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "string",
  "quantity": 1
}
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "quantity": 1,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "product": {
    "id": "string",
    "name": "string",
    "price": 189,
    "image": "string"
  }
}
```

---

### Update Cart Item

```http
PUT /api/cart/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "quantity": 3,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "product": {
    "id": "string",
    "name": "string",
    "price": 189,
    "image": "string"
  }
}
```

---

### Remove from Cart

```http
DELETE /api/cart/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Item removed from cart successfully"
}
```

---

### Clear Cart

```http
DELETE /api/cart
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## 📦 Orders

### Create Order

```http
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "status": "pending",
  "total": 208.89,
  "shipping": 9.99,
  "tax": 15.12,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "items": [
    {
      "id": "string",
      "orderId": "string",
      "productId": "string",
      "quantity": 1,
      "price": 189,
      "product": {
        "id": "string",
        "name": "string",
        "image": "string"
      }
    }
  ],
  "shippingAddress": {
    "id": "string",
    "orderId": "string",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }
}
```

---

### Get Orders

```http
GET /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "status": "pending",
    "total": 208.89,
    "shipping": 9.99,
    "tax": 15.12,
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "items": [...],
    "shippingAddress": {...}
  }
]
```

---

### Get Order by ID

```http
GET /api/orders/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "string",
  "userId": "string",
  "status": "pending",
  "total": 208.89,
  "shipping": 9.99,
  "tax": 15.12,
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "items": [...],
  "shippingAddress": {...}
}
```

---

### Update Order Status

```http
PATCH /api/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Status Values:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Response (200):**
```json
{
  "id": "string",
  "userId": "string",
  "status": "processing",
  "total": 208.89,
  "items": [...],
  "shippingAddress": {...}
}
```

---

## 👤 Users

### Get Profile

```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "name": "string",
  "photoURL": "string | null",
  "provider": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### Update Profile

```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Response (200):**
```json
{
  "id": "string",
  "username": "string",
  "email": "newemail@example.com",
  "name": "New Name",
  "photoURL": "https://example.com/photo.jpg",
  "provider": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### Get Addresses

```http
GET /api/users/addresses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "userId": "string",
    "name": "Home",
    "street": "123 Nordic Street",
    "city": "Stockholm",
    "state": "Stockholm",
    "zipCode": "11122",
    "country": "Sweden",
    "isDefault": true,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

---

### Add Address

```http
POST /api/users/addresses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Office",
  "street": "456 Business Ave",
  "city": "Stockholm",
  "state": "Stockholm",
  "zipCode": "11133",
  "country": "Sweden",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "id": "string",
  "userId": "string",
  "name": "Office",
  "street": "456 Business Ave",
  "city": "Stockholm",
  "state": "Stockholm",
  "zipCode": "11133",
  "country": "Sweden",
  "isDefault": false,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### Update Address

```http
PUT /api/users/addresses/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Home",
  "isDefault": true
}
```

**Response (200):**
```json
{
  "id": "string",
  "userId": "string",
  "name": "Updated Home",
  "street": "123 Nordic Street",
  "city": "Stockholm",
  "state": "Stockholm",
  "zipCode": "11122",
  "country": "Sweden",
  "isDefault": true,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### Delete Address

```http
DELETE /api/users/addresses/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Address deleted successfully"
}
```

---

## ❤️ Favorites

### Get Favorites

```http
GET /api/favorites
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "string",
    "name": "Nordic Wool Throw",
    "description": "Hand-woven pure new wool blanket",
    "price": 189,
    "originalPrice": 229,
    "image": "https://example.com/image.jpg",
    "category": "Home Textiles",
    "rating": 4.8,
    "reviews": 124,
    "inStock": true,
    "createdAt": "datetime"
  }
]
```

---

### Add to Favorites

```http
POST /api/favorites/:productId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "id": "string",
  "name": "Nordic Wool Throw",
  "description": "Hand-woven pure new wool blanket",
  "price": 189,
  "image": "https://example.com/image.jpg",
  "category": "Home Textiles",
  "rating": 4.8,
  "reviews": 124,
  "inStock": true
}
```

**Error Response (400):**
```json
{
  "error": "Already in favorites",
  "message": "Product is already in your favorites"
}
```

---

### Remove from Favorites

```http
DELETE /api/favorites/:productId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Removed from favorites successfully"
}
```

---

### Check Favorite Status

```http
GET /api/favorites/check/:productId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "isFavorite": true
}
```

---

## 🔧 Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-03-28T04:00:00.000Z"
}
```

---

## 📝 Data Models

### Product

```typescript
{
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### User

```typescript
{
  id: string
  username: string
  email: string
  name: string
  photoURL?: string
  provider: "credentials" | "google" | "github"
  createdAt: DateTime
  updatedAt: DateTime
}
```

### CartItem

```typescript
{
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: DateTime
  updatedAt: DateTime
  product: Product
}
```

### Order

```typescript
{
  id: string
  userId: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  shipping: number
  tax: number
  createdAt: DateTime
  updatedAt: DateTime
  items: OrderItem[]
  shippingAddress: ShippingAddress
}
```

### OrderItem

```typescript
{
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}
```

### Review

```typescript
{
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  helpful: number
  createdAt: DateTime
}
```

### Address

```typescript
{
  id: string
  userId: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### ShippingAddress

```typescript
{
  id: string
  orderId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}
```

---

## 🔑 Authentication

### Protected Endpoints

The following endpoints require authentication:

- All `/api/cart` endpoints
- All `/api/orders` endpoints
- All `/api/users` endpoints
- All `/api/favorites` endpoints
- `POST /api/products/:id/reviews`

### Authentication Header

```http
Authorization: Bearer <JWT_TOKEN>
```

### Token Acquisition

- Token is returned upon successful login or registration
- Token should be stored in `localStorage` with key `auth_token`
- Token is automatically included in requests via `fetchWithAuth` helper

---

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd backend
pnpm dev
```

Server runs on `http://localhost:3001`

### 2. Seed Database

```bash
cd backend
pnpm prisma:seed
```

### 3. Test API

```bash
# Health check
curl http://localhost:3001/health

# Get products
curl http://localhost:3001/api/products

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"password123"}'
```

---

## 📊 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 📚 Additional Resources

- [Backend Source Code](../backend/src/)
- [Frontend API Client](../src/lib/api.ts)
- [Database Schema](../backend/prisma/schema.prisma)

---

*Last Updated: 2026-03-28*