import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Star,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'

function Cart() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { items: cart, updateQuantity, removeItem, getItemCount, getTotal } = useCartStore()

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  const cartTotal = getTotal()
  const cartCount = getItemCount()
  const shipping = cartTotal > 100 ? 0 : 9.99
  const finalTotal = cartTotal + shipping

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
          <span className="text-charcoal">Shopping Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-charcoal">Shopping Cart</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-nordic-blue hover:text-nordic-blue-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-charcoal mb-2">Your cart is empty</h2>
            <p className="text-slate mb-6">Looks like you haven't added any items yet.</p>
            <Button onClick={() => navigate('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-stone-100 p-6 flex gap-6"
                >
                  {/* Image */}
                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden bg-frost flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-slate uppercase tracking-wider">
                          {item.product.category}
                        </p>
                        <h3
                          className="font-medium text-charcoal cursor-pointer hover:text-nordic-blue transition-colors"
                          onClick={() => navigate(`/product/${item.product.id}`)}
                        >
                          {item.product.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-slate hover:text-rose-ash transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-cedar fill-cedar" />
                      <span className="text-sm font-medium text-charcoal">
                        {item.product.rating}
                      </span>
                      <span className="text-sm text-slate">({item.product.reviews})</span>
                    </div>

                    {/* Price and quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            onClick={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 text-charcoal hover:bg-frost transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 text-charcoal hover:bg-frost transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="p-2 text-slate hover:text-rose-ash transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-charcoal">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-slate">${item.product.price} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-charcoal mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-sage">
                      Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-stone-100 pt-4 flex justify-between">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="text-xl font-semibold text-nordic-blue">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>

                <div className="mt-6 space-y-3 text-sm text-slate">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-nordic-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-nordic-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-nordic-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Cart