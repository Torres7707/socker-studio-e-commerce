import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Review } from '@/schemas'
import { productsApi } from '@/lib/api'

interface ReviewState {
  reviews: Review[]
  isLoading: boolean
  addReview: (productId: string, data: { rating: number; comment: string }) => Promise<void>
  getProductReviews: (productId: string) => Promise<Review[]>
  markHelpful: (productId: string, reviewId: string) => Promise<void>
  getAverageRating: (productId: string) => number
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      isLoading: false,

      addReview: async (productId: string, data: { rating: number; comment: string }) => {
        try {
          set({ isLoading: true })
          await productsApi.addReview(productId, data)
          
          // Refresh reviews for this product
          const reviews = await productsApi.getProductReviews(productId)
          set((state) => ({
            reviews: [
              ...reviews,
              ...state.reviews.filter(r => r.productId !== productId)
            ],
            isLoading: false
          }))
        } catch (error) {
          console.error('Failed to add review:', error)
          set({ isLoading: false })
          throw error
        }
      },

      getProductReviews: async (productId: string) => {
        try {
          set({ isLoading: true })
          const reviews = await productsApi.getProductReviews(productId)
          
          // Update state with fetched reviews
          set((state) => ({
            reviews: [
              ...reviews,
              ...state.reviews.filter(r => r.productId !== productId)
            ],
            isLoading: false
          }))
          
          return reviews
        } catch (error) {
          console.error('Failed to fetch reviews:', error)
          set({ isLoading: false })
          return []
        }
      },

      markHelpful: async (productId: string, reviewId: string) => {
        try {
          await productsApi.markReviewHelpful(productId, reviewId)
          
          // Update local state
          set((state) => ({
            reviews: state.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, helpful: review.helpful + 1 }
                : review
            ),
          }))
        } catch (error) {
          console.error('Failed to mark review as helpful:', error)
          throw error
        }
      },

      getAverageRating: (productId: string) => {
        const productReviews = get().reviews.filter(
          (review) => review.productId === productId
        )
        if (productReviews.length === 0) return 0
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
        return sum / productReviews.length
      },
    }),
    {
      name: 'scandinavian_shop_reviews',
    }
  )
)
