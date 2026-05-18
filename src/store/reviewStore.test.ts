import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useReviewStore } from './reviewStore'

const mockReviews = [
  {
    id: 'review1',
    productId: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent product!',
    date: '2026-01-01',
    helpful: 0,
  },
  {
    id: 'review2',
    productId: '1',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Good quality',
    date: '2026-01-02',
    helpful: 2,
  },
]

// Mock the API module
vi.mock('@/lib/api', () => ({
  productsApi: {
    getProductReviews: vi.fn().mockResolvedValue([]),
    addReview: vi.fn().mockResolvedValue({}),
    markReviewHelpful: vi.fn().mockResolvedValue({}),
  },
}))

describe('ReviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({ reviews: [], isLoading: false })
    vi.clearAllMocks()
  })

  it('starts with empty reviews', () => {
    const { reviews } = useReviewStore.getState()
    expect(reviews).toHaveLength(0)
  })

  it('fetches product reviews', async () => {
    const { productsApi } = await import('@/lib/api')
    vi.mocked(productsApi.getProductReviews).mockResolvedValueOnce(mockReviews)

    const { getProductReviews } = useReviewStore.getState()
    const reviews = await getProductReviews('1')

    expect(reviews).toHaveLength(2)
    expect(reviews[0].id).toBe('review1')
    expect(productsApi.getProductReviews).toHaveBeenCalledWith('1')
  })

  it('adds a review', async () => {
    const { productsApi } = await import('@/lib/api')
    vi.mocked(productsApi.addReview).mockResolvedValueOnce({})
    vi.mocked(productsApi.getProductReviews).mockResolvedValueOnce([mockReviews[0]])

    const { addReview } = useReviewStore.getState()
    await addReview('1', { rating: 5, comment: 'Excellent product!' })

    expect(productsApi.addReview).toHaveBeenCalledWith('1', { rating: 5, comment: 'Excellent product!' })
    expect(productsApi.getProductReviews).toHaveBeenCalledWith('1')
  })

  it('marks review as helpful', async () => {
    useReviewStore.setState({ reviews: [...mockReviews] })

    const { markHelpful } = useReviewStore.getState()
    await markHelpful('1', 'review1')

    const { reviews } = useReviewStore.getState()
    expect(reviews[0].helpful).toBe(1)
    expect(reviews[1].helpful).toBe(2) // Unchanged
  })

  it('calculates average rating for product', () => {
    useReviewStore.setState({ reviews: [...mockReviews] })

    const { getAverageRating } = useReviewStore.getState()
    const averageRating = getAverageRating('1')

    expect(averageRating).toBe(4.5) // (5 + 4) / 2
  })

  it('returns 0 for product with no reviews', () => {
    const { getAverageRating } = useReviewStore.getState()
    const averageRating = getAverageRating('non-existent')
    expect(averageRating).toBe(0)
  })
})
