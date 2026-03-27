import { describe, it, expect, beforeEach } from 'vitest'
import { useReviewStore } from './reviewStore'

const mockReview = {
  productId: '1',
  userId: 'user1',
  userName: 'John Doe',
  rating: 5,
  comment: 'Excellent product!',
}

const mockReview2 = {
  productId: '1',
  userId: 'user2',
  userName: 'Jane Smith',
  rating: 4,
  comment: 'Good quality',
}

const mockReview3 = {
  productId: '2',
  userId: 'user1',
  userName: 'John Doe',
  rating: 3,
  comment: 'Average product',
}

describe('ReviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({ reviews: [] })
  })

  it('starts with empty reviews', () => {
    const { reviews } = useReviewStore.getState()
    expect(reviews).toHaveLength(0)
  })

  it('adds a review', () => {
    const { addReview } = useReviewStore.getState()
    
    addReview(mockReview)
    
    const { reviews } = useReviewStore.getState()
    expect(reviews).toHaveLength(1)
    expect(reviews[0].productId).toBe('1')
    expect(reviews[0].userId).toBe('user1')
    expect(reviews[0].rating).toBe(5)
    expect(reviews[0].comment).toBe('Excellent product!')
  })

  it('generates review id and date', () => {
    const { addReview } = useReviewStore.getState()
    
    addReview(mockReview)
    
    const { reviews } = useReviewStore.getState()
    expect(reviews[0].id).toBeDefined()
    expect(reviews[0].date).toBeDefined()
    expect(reviews[0].helpful).toBe(0)
  })

  it('adds review to beginning of list', () => {
    const { addReview } = useReviewStore.getState()
    
    addReview(mockReview)
    addReview(mockReview2)
    
    const { reviews } = useReviewStore.getState()
    expect(reviews[0].userId).toBe('user2')
    expect(reviews[1].userId).toBe('user1')
  })

  it('gets reviews for specific product', () => {
    const { addReview, getProductReviews } = useReviewStore.getState()
    
    addReview(mockReview) // Product 1
    addReview(mockReview2) // Product 1
    addReview(mockReview3) // Product 2
    
    const product1Reviews = getProductReviews('1')
    const product2Reviews = getProductReviews('2')
    
    expect(product1Reviews).toHaveLength(2)
    expect(product2Reviews).toHaveLength(1)
    expect(product1Reviews[0].productId).toBe('1')
    expect(product2Reviews[0].productId).toBe('2')
  })

  it('returns empty array for product with no reviews', () => {
    const { getProductReviews } = useReviewStore.getState()
    
    const reviews = getProductReviews('non-existent')
    
    expect(reviews).toHaveLength(0)
  })

  it('marks review as helpful', () => {
    const { addReview, markHelpful } = useReviewStore.getState()
    
    addReview(mockReview)
    const { reviews } = useReviewStore.getState()
    const reviewId = reviews[0].id
    
    markHelpful(reviewId)
    
    const updatedReviews = useReviewStore.getState().reviews
    expect(updatedReviews[0].helpful).toBe(1)
  })

  it('increments helpful count', () => {
    const { addReview, markHelpful } = useReviewStore.getState()
    
    addReview(mockReview)
    const { reviews } = useReviewStore.getState()
    const reviewId = reviews[0].id
    
    markHelpful(reviewId)
    markHelpful(reviewId)
    markHelpful(reviewId)
    
    const updatedReviews = useReviewStore.getState().reviews
    expect(updatedReviews[0].helpful).toBe(3)
  })

  it('calculates average rating for product', () => {
    const { addReview, getAverageRating } = useReviewStore.getState()
    
    addReview(mockReview) // Rating 5
    addReview(mockReview2) // Rating 4
    
    const averageRating = getAverageRating('1')
    
    expect(averageRating).toBe(4.5)
  })

  it('returns 0 for product with no reviews', () => {
    const { getAverageRating } = useReviewStore.getState()
    
    const averageRating = getAverageRating('non-existent')
    
    expect(averageRating).toBe(0)
  })

  it('calculates average rating for different products separately', () => {
    const { addReview, getAverageRating } = useReviewStore.getState()
    
    addReview(mockReview) // Product 1, Rating 5
    addReview(mockReview2) // Product 1, Rating 4
    addReview(mockReview3) // Product 2, Rating 3
    
    const product1Rating = getAverageRating('1')
    const product2Rating = getAverageRating('2')
    
    expect(product1Rating).toBe(4.5)
    expect(product2Rating).toBe(3)
  })

  it('handles multiple reviews from same user', () => {
    const { addReview, getProductReviews } = useReviewStore.getState()
    
    addReview(mockReview) // User 1, Product 1
    addReview(mockReview3) // User 1, Product 2
    
    const product1Reviews = getProductReviews('1')
    const product2Reviews = getProductReviews('2')
    
    expect(product1Reviews).toHaveLength(1)
    expect(product2Reviews).toHaveLength(1)
    expect(product1Reviews[0].userId).toBe('user1')
    expect(product2Reviews[0].userId).toBe('user1')
  })

  it('maintains review order (newest first)', async () => {
    const { addReview, getProductReviews } = useReviewStore.getState()
    
    addReview(mockReview)
    
    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10))
    
    addReview(mockReview2)
    
    const reviews = getProductReviews('1')
    
    expect(reviews[0].userId).toBe('user2') // Newest first
    expect(reviews[1].userId).toBe('user1')
  })

  it('handles review with different ratings', () => {
    const { addReview, getAverageRating } = useReviewStore.getState()
    
    const review1 = { ...mockReview, rating: 1 }
    const review2 = { ...mockReview2, rating: 2 }
    const review3 = { ...mockReview, userId: 'user3', rating: 3 }
    
    addReview(review1)
    addReview(review2)
    addReview(review3)
    
    const averageRating = getAverageRating('1')
    
    expect(averageRating).toBe(2) // (1 + 2 + 3) / 3
  })

  it('handles review with edge case ratings', () => {
    const { addReview, getAverageRating } = useReviewStore.getState()
    
    const review1 = { ...mockReview, rating: 0 }
    const review2 = { ...mockReview2, rating: 5 }
    
    addReview(review1)
    addReview(review2)
    
    const averageRating = getAverageRating('1')
    
    expect(averageRating).toBe(2.5) // (0 + 5) / 2
  })
})