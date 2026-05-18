import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { ordersApi } from '@/lib/api'
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronRight,
  CreditCard,
  Truck,
  MapPin,
  Check,
} from 'lucide-react'

interface ShippingAddress {
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

function Checkout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { items: cart, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const cartTotal = getTotal()
  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const finalTotal = cartTotal + shipping + tax

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    try {
      const order = await ordersApi.createOrder({
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
      })
      setOrderId(order.id)
      clearCart()
      setOrderComplete(true)
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-sage" />
          </div>
          <h1 className="text-3xl font-semibold text-charcoal mb-4">Order Confirmed!</h1>
          <p className="text-slate mb-2">Thank you for your purchase.</p>
          <p className="text-slate mb-8">
            Order #{orderId?.slice(-8) || 'N/A'} has been placed successfully.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button variant="outline" className="w-full">
              View Order Details
            </Button>
          </div>
        </div>
      </div>
    )
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
              <button className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors">
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
          <button onClick={() => navigate('/cart')} className="hover:text-nordic-blue transition-colors">
            Cart
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-charcoal">Checkout</span>
        </nav>

        <h1 className="text-3xl font-semibold text-charcoal mb-8">Checkout</h1>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s
                    ? 'bg-nordic-blue text-white'
                    : 'bg-stone-100 text-slate'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step > s ? 'bg-nordic-blue' : 'bg-stone-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-nordic-blue" />
                  <h2 className="text-lg font-semibold text-charcoal">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button className="w-full mt-6" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-nordic-blue" />
                  <h2 className="text-lg font-semibold text-charcoal">Payment Method</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:border-nordic-blue transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-nordic-blue"
                    />
                    <CreditCard className="w-5 h-5 text-slate" />
                    <span className="font-medium text-charcoal">Credit / Debit Card</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5 text-nordic-blue" />
                  <h2 className="text-lg font-semibold text-charcoal">Review Order</h2>
                </div>

                {/* Shipping address summary */}
                <div className="mb-6 p-4 bg-frost rounded-xl">
                  <h3 className="font-medium text-charcoal mb-2">Shipping Address</h3>
                  <p className="text-slate text-sm">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                    <br />
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    <br />
                    {shippingAddress.country}
                  </p>
                </div>

                {/* Payment method summary */}
                <div className="mb-6 p-4 bg-frost rounded-xl">
                  <h3 className="font-medium text-charcoal mb-2">Payment Method</h3>
                  <p className="text-slate text-sm">
                    Credit Card ending in {cardNumber.slice(-4) || '****'}
                  </p>
                </div>

                {/* Order items */}
                <div className="mb-6">
                  <h3 className="font-medium text-charcoal mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-charcoal">{item.product.name}</p>
                          <p className="text-sm text-slate">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-charcoal">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-charcoal mb-6">Order Summary</h2>

              {/* Cart items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{item.product.name}</p>
                      <p className="text-xs text-slate">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-charcoal">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-stone-100 pt-4">
                <div className="flex justify-between text-slate">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="text-xl font-semibold text-nordic-blue">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout