import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Copy,
} from 'lucide-react'

interface TrackingEvent {
  date: string
  time: string
  status: string
  location: string
  description: string
}

interface OrderDetails {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered'
  estimatedDelivery: string
  trackingNumber: string
  carrier: string
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  trackingEvents: TrackingEvent[]
}

function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [copied, setCopied] = useState(false)

  // Mock order data
  const orderDetails: OrderDetails = {
    id: orderId || 'SS12345678',
    date: '2026-03-25',
    status: 'out-for-delivery',
    estimatedDelivery: '2026-03-27',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    items: [
      {
        id: '1',
        name: 'Nordic Wool Throw',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        quantity: 2,
        price: 189,
      },
      {
        id: '3',
        name: 'Oak Dining Chair',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
        quantity: 1,
        price: 299,
      },
    ],
    shippingAddress: {
      name: user?.name || 'John Doe',
      address: '123 Nordic Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '+1 (555) 123-4567',
    },
    trackingEvents: [
      {
        date: '2026-03-27',
        time: '08:30 AM',
        status: 'Out for Delivery',
        location: 'San Francisco, CA',
        description: 'Package is out for delivery',
      },
      {
        date: '2026-03-27',
        time: '06:15 AM',
        status: 'Arrived at Local Facility',
        location: 'San Francisco, CA',
        description: 'Package arrived at local delivery facility',
      },
      {
        date: '2026-03-26',
        time: '11:45 PM',
        status: 'In Transit',
        location: 'Oakland, CA',
        description: 'Package in transit to destination',
      },
      {
        date: '2026-03-26',
        time: '02:30 PM',
        status: 'Departed Facility',
        location: 'Los Angeles, CA',
        description: 'Package departed from sorting facility',
      },
      {
        date: '2026-03-25',
        time: '04:00 PM',
        status: 'Shipped',
        location: 'Los Angeles, CA',
        description: 'Package has been shipped',
      },
      {
        date: '2026-03-25',
        time: '10:00 AM',
        status: 'Order Processed',
        location: 'Warehouse',
        description: 'Order has been processed and packed',
      },
    ],
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'shipped':
        return <Package className="w-6 h-6 text-blue-500" />
      case 'out-for-delivery':
        return <Truck className="w-6 h-6 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-sage" />
      default:
        return <Clock className="w-6 h-6 text-slate" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'out-for-delivery':
        return 'Out for Delivery'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(orderDetails.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-snow">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-charcoal">Socker Studio</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-sage" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                  <p className="text-xs text-slate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate hover:text-charcoal"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate mb-8">
          <button onClick={() => navigate('/')} className="hover:text-nordic-blue transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/profile')} className="hover:text-nordic-blue transition-colors">
            My Account
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/profile')} className="hover:text-nordic-blue transition-colors">
            Orders
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-charcoal">Order #{orderDetails.id}</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-charcoal">Order Tracking</h1>
            <p className="text-slate mt-1">Order #{orderDetails.id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
            {getStatusText(orderDetails.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                {getStatusIcon(orderDetails.status)}
                <div>
                  <h2 className="text-xl font-semibold text-charcoal">
                    {getStatusText(orderDetails.status)}
                  </h2>
                  <p className="text-slate">
                    Estimated delivery: {orderDetails.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => (
                    <div
                      key={step}
                      className={`text-xs font-medium ${
                        index <=
                        (orderDetails.status === 'processing'
                          ? 0
                          : orderDetails.status === 'shipped'
                          ? 1
                          : orderDetails.status === 'out-for-delivery'
                          ? 2
                          : 3)
                          ? 'text-nordic-blue'
                          : 'text-slate'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nordic-blue transition-all duration-500"
                    style={{
                      width: `${
                        orderDetails.status === 'processing'
                          ? 25
                          : orderDetails.status === 'shipped'
                          ? 50
                          : orderDetails.status === 'out-for-delivery'
                          ? 75
                          : 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Tracking Number */}
              <div className="flex items-center justify-between p-4 bg-frost rounded-xl">
                <div>
                  <p className="text-sm text-slate">Tracking Number</p>
                  <p className="font-mono font-medium text-charcoal">{orderDetails.trackingNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate">{orderDetails.carrier}</span>
                  <button
                    onClick={copyTrackingNumber}
                    className="p-2 text-slate hover:text-nordic-blue transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && <span className="text-xs text-sage">Copied!</span>}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-6">Tracking History</h3>
              <div className="space-y-6">
                {orderDetails.trackingEvents.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-nordic-blue' : 'bg-stone-200'
                        }`}
                      />
                      {index < orderDetails.trackingEvents.length - 1 && (
                        <div className="w-0.5 h-12 bg-stone-100 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-charcoal">{event.status}</p>
                        <span className="text-sm text-slate">
                          {event.date} at {event.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate mb-1">{event.description}</p>
                      <div className="flex items-center gap-1 text-xs text-slate">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Delivery Address</h3>
              <div className="space-y-2">
                <p className="font-medium text-charcoal">{orderDetails.shippingAddress.name}</p>
                <p className="text-slate text-sm">{orderDetails.shippingAddress.address}</p>
                <p className="text-slate text-sm">
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{' '}
                  {orderDetails.shippingAddress.zipCode}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                  <Phone className="w-4 h-4 text-slate" />
                  <span className="text-sm text-slate">{orderDetails.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-charcoal text-sm">{item.name}</p>
                      <p className="text-xs text-slate">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-charcoal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-semibold text-nordic-blue">
                    ${orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Report an Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderTracking