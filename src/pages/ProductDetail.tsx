import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useReviewStore } from '@/store/reviewStore'
import { productsApi } from '@/lib/api'
import { type Product, type Review } from '@/schemas'
import Layout from '@/components/Layout'
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ThumbsUp,
  Send,
} from 'lucide-react'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items: cart, addItem, getItemCount, getTotal } = useCartStore()
  const { isFavorite, toggleFavorite } = useFavoritesStore()
  const { getProductReviews, addReview, markHelpful, getAverageRating } = useReviewStore()
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productReviews, setProductReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await productsApi.getProduct(id)
        setProduct(data)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    getProductReviews(product.id).then(setProductReviews)
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nordic-blue mx-auto mb-4"></div>
          <p className="text-slate">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  const addToCart = () => {
    addItem(product, quantity)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product.id)
  }

  const handleSubmitReview = async () => {
    if (!user || !newReview.comment.trim()) return
    await addReview(product.id, { rating: newReview.rating, comment: newReview.comment.trim() })
    setNewReview({ rating: 5, comment: '' })
    setShowReviewForm(false)
  }

  const cartTotal = getTotal()
  const cartCount = getItemCount()
  const averageRating = getAverageRating(product.id) || product.rating

  return (
    <Layout>
      {/* Main content */}
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate mb-8">
          <button onClick={() => navigate('/')} className="hover:text-nordic-blue transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/')} className="hover:text-nordic-blue transition-colors">
            {product.category}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-frost">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-sage text-white text-sm font-medium rounded-md">
                  Sale
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="text-charcoal font-medium text-xl">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-3xl font-semibold text-charcoal mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-cedar fill-cedar'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-charcoal">{averageRating.toFixed(1)}</span>
                <span className="text-slate">({productReviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-semibold text-charcoal">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-slate line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="text-sage font-medium">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-charcoal mb-2">Description</h3>
              <p className="text-slate leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div>
                <h3 className="font-medium text-charcoal mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-charcoal hover:bg-frost transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-charcoal hover:bg-frost transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-slate">
                    ${(product.price * quantity).toFixed(2)} total
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={addToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleFavorite}
                className={isFavorite(product.id) ? 'text-rose-ash border-rose-ash' : ''}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-stone-100 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate">
                <Truck className="w-5 h-5 text-nordic-blue" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-slate">
                <Shield className="w-5 h-5 text-nordic-blue" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center gap-3 text-slate">
                <RotateCcw className="w-5 h-5 text-nordic-blue" />
                <span>30-day return policy</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-stone-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-charcoal">Customer Reviews</h3>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Write a Review
                  </Button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-frost rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-charcoal mb-3">Write Your Review</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                            className="p-1"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                i < newReview.rating
                                  ? 'text-cedar fill-cedar'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        className="mt-1 w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nordic-blue resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSubmitReview}>
                        <Send className="w-4 h-4 mr-1" />
                        Submit Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-slate text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                  productReviews.map((review) => (
                    <div key={review.id} className="border border-stone-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-sage">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-charcoal text-sm">{review.userName}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'text-cedar fill-cedar'
                                      : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate">{review.date}</span>
                      </div>
                      <p className="text-slate text-sm mb-3">{review.comment}</p>
                      <button
                        onClick={() => markHelpful(product.id, review.id)}
                        className="flex items-center gap-1 text-xs text-slate hover:text-nordic-blue transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

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
            <span className="text-lg font-semibold text-nordic-blue">${cartTotal.toFixed(2)}</span>
          </div>
          <Button className="w-full mt-4" onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
        </div>
      )}
    </Layout>
  )
}

export default ProductDetail