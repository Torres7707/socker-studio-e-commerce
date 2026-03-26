import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { products, categories, type Product } from '@/data/products'
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  LogOut,
  Star,
  Plus,
  Minus,
} from 'lucide-react'

interface CartItem {
  product: Product
  quantity: number
}

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter((item) => item.product.id !== productId)
    })
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

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
              <span className="text-lg font-semibold text-charcoal">Nordic</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <button className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-nordic-blue text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Favorites */}
              <button className="relative p-2 text-charcoal hover:text-nordic-blue transition-colors">
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-ash text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-sage" />
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
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-charcoal">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate mt-1">
            Discover beautiful Scandinavian design for your home
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-nordic-blue text-white'
                  : 'bg-white text-charcoal border border-stone-200 hover:border-nordic-blue hover:text-nordic-blue'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:shadow-stone/5 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-frost">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all ${
                    favorites.includes(product.id)
                      ? 'text-rose-ash'
                      : 'text-slate hover:text-rose-ash'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={favorites.includes(product.id) ? 'currentColor' : 'none'}
                  />
                </button>
                {/* Sale badge */}
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-sage text-white text-xs font-medium rounded-md">
                    Sale
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="text-charcoal font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-slate uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-medium text-charcoal mb-1">{product.name}</h3>
                <p className="text-sm text-slate line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 text-cedar fill-cedar" />
                  <span className="text-sm font-medium text-charcoal">
                    {product.rating}
                  </span>
                  <span className="text-sm text-slate">({product.reviews})</span>
                </div>

                {/* Price and add to cart */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-charcoal">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {cart.find((item) => item.product.id === product.id) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 rounded-lg bg-frost flex items-center justify-center text-charcoal hover:bg-mist transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium">
                        {cart.find((item) => item.product.id === product.id)?.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-8 h-8 rounded-lg bg-nordic-blue flex items-center justify-center text-white hover:bg-nordic-blue-light transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Cart summary - floating */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl border border-stone-100 p-4 min-w-[280px]">
          <h3 className="font-medium text-charcoal mb-3">Your Cart</h3>
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-charcoal">{item.product.name}</span>
                <span className="text-slate">
                  {item.quantity} x ${item.product.price}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
            <span className="font-medium text-charcoal">Total</span>
            <span className="text-lg font-semibold text-nordic-blue">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <Button className="w-full mt-4">Checkout</Button>
        </div>
      )}
    </div>
  )
}

export default Home
