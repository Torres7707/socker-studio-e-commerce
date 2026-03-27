import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Login from '@/components/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import ReadmeGenerator from '@/pages/ReadmeGenerator'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Profile from '@/pages/Profile'
import Favorites from '@/pages/Favorites'
import OrderTracking from '@/pages/OrderTracking'
import AboutSocker from '@/pages/AboutSocker'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/generate" element={<ReadmeGenerator />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/order/:orderId" element={<OrderTracking />} />
      <Route path="/about" element={<AboutSocker />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/generate" replace />} />
    </Routes>
  )
}

function App() {
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      initializeAuthListener()
    }
  }, [initializeAuthListener])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
