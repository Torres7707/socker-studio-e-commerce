import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ordersApi } from '@/lib/api'
import { toast } from 'sonner'
import Layout from '@/components/Layout'
import {
  ChevronRight,
  Package,
  CheckCircle,
  Clock,
  X,
  Phone,
} from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  image: string
  quantity: number
  price: number
}

interface OrderDetails {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  total: number
  shipping: number
  tax: number
}

function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No order ID provided')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const order = await ordersApi.getOrder(orderId)
        setOrderDetails({
          id: order.id,
          date: order.createdAt,
          status: order.status,
          items: order.items.map((item: any) => ({
            id: item.id,
            name: item.product.name,
            image: item.product.image,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zipCode: order.shippingAddress.zipCode,
            phone: order.shippingAddress.phone,
          },
          total: order.total,
          shipping: order.shipping,
          tax: order.tax,
        })
      } catch (error) {
        console.error('Failed to fetch order:', error)
        setError('Failed to load order details')
        toast.error('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'processing':
        return <Clock className="w-6 h-6 text-blue-500" />
      case 'shipped':
        return <Package className="w-6 h-6 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-sage" />
      case 'cancelled':
        return <X className="w-6 h-6 text-red-500" />
      default:
        return <Clock className="w-6 h-6 text-slate" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-blue"></div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-charcoal mb-4">
            {error || 'Order not found'}
          </h2>
          <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
        </div>
      </div>
    )
  }

  const statusStep = orderDetails.status === 'pending'
    ? 0
    : orderDetails.status === 'processing'
    ? 1
    : orderDetails.status === 'shipped'
    ? 2
    : orderDetails.status === 'delivered'
    ? 3
    : -1

  return (
    <Layout>
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
                    {orderDetails.status === 'delivered'
                      ? 'Your order has been delivered'
                      : orderDetails.status === 'shipped'
                      ? 'Your order has been shipped'
                      : orderDetails.status === 'cancelled'
                      ? 'This order has been cancelled'
                      : 'Estimated delivery will be available once shipped'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                    <div
                      key={step}
                      className={`text-xs font-medium ${
                        statusStep >= 0 && index <= statusStep
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
                      width: `${statusStep >= 0 ? (statusStep / 3) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Order Date</span>
                  <span className="text-charcoal">{new Date(orderDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Subtotal</span>
                  <span className="text-charcoal">${(orderDetails.total - orderDetails.shipping - orderDetails.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Shipping</span>
                  <span className="text-charcoal">${orderDetails.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Tax</span>
                  <span className="text-charcoal">${orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-stone-100">
                  <span className="text-charcoal">Total</span>
                  <span className="text-nordic-blue">${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
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
    </Layout>
  )
}

export default OrderTracking
