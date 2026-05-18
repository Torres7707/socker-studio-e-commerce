import { useEffect, useRef, Component, type ReactNode } from 'react'
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

// Error Boundary
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-snow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-nordic-blue text-white rounded-lg"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-blue" />
      </div>
    )
  }
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
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/order/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
      <Route path="/about" element={<AboutSocker />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
