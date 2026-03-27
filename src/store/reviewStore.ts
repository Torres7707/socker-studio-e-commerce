import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Review } from '@/schemas'

interface ReviewState {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void
  getProductReviews: (productId: string) => Review[]
  markHelpful: (reviewId: string) => void
  getAverageRating: (productId: string) => number
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: '1',
          productId: '1',
          userId: '1',
          userName: 'Sarah M.',
          rating: 5,
          comment: 'Absolutely love this wool throw! The quality is exceptional and it adds such a cozy touch to my living room.',
          date: '2026-03-20',
          helpful: 12,
        },
        {
          id: '2',
          productId: '1',
          userId: '2',
          userName: 'Michael K.',
          rating: 4,
          comment: 'Great quality and beautiful design. Shipping was fast too!',
          date: '2026-03-18',
          helpful: 8,
        },
        {
          id: '3',
          productId: '2',
          userId: '3',
          userName: 'Emma L.',
          rating: 5,
          comment: 'Perfect minimalist vase. Looks exactly like the photos.',
          date: '2026-03-15',
          helpful: 5,
        },
        {
          id: '4',
          productId: '3',
          userId: '4',
          userName: 'David R.',
          rating: 4,
          comment: 'Solid oak chair, very comfortable. Assembly was straightforward.',
          date: '2026-03-10',
          helpful: 15,
        },
      ],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          helpful: 0,
        }
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }))
      },

      getProductReviews: (productId) => {
        return get().reviews.filter((review) => review.productId === productId)
      },

      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        }))
      },

      getAverageRating: (productId) => {
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