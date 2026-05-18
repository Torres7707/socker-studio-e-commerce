import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from './cartStore'
import { type Product } from '@/schemas'

// Mock the API module
vi.mock('@/lib/api', () => ({
  cartApi: {
    getCart: vi.fn().mockResolvedValue([]),
    addToCart: vi.fn().mockResolvedValue({}),
    removeFromCart: vi.fn().mockResolvedValue({}),
    updateCartItem: vi.fn().mockResolvedValue({}),
    clearCart: vi.fn().mockResolvedValue({}),
  },
}))

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 100,
  image: 'https://example.com/image.jpg',
  category: 'Test',
  rating: 4.5,
  reviews: 10,
  inStock: true,
  description: 'Test description',
}

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  price: 50,
  image: 'https://example.com/image2.jpg',
  category: 'Test',
  rating: 4.0,
  reviews: 5,
  inStock: true,
  description: 'Test description 2',
}

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isLoading: false })
    vi.clearAllMocks()
  })

  it('starts with empty cart', () => {
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('adds item to cart', async () => {
    const { addItem } = useCartStore.getState()
    await addItem(mockProduct)
    // After addItem, fetchCart is called which updates items
    // Since we mocked getCart to return [], items will still be []
    // But the API was called correctly
    const { cartApi } = await import('@/lib/api')
    expect(cartApi.addToCart).toHaveBeenCalledWith('1', 1)
  })

  it('adds item with quantity', async () => {
    const { addItem } = useCartStore.getState()
    await addItem(mockProduct, 3)
    const { cartApi } = await import('@/lib/api')
    expect(cartApi.addToCart).toHaveBeenCalledWith('1', 3)
  })

  it('calculates item count correctly', () => {
    useCartStore.setState({
      items: [
        { id: '1', product: mockProduct, quantity: 2 },
        { id: '2', product: mockProduct2, quantity: 1 },
      ],
    })
    const { getItemCount } = useCartStore.getState()
    expect(getItemCount()).toBe(3)
  })

  it('calculates total correctly', () => {
    useCartStore.setState({
      items: [
        { id: '1', product: mockProduct, quantity: 2 },
        { id: '2', product: mockProduct2, quantity: 1 },
      ],
    })
    const { getTotal } = useCartStore.getState()
    expect(getTotal()).toBe(250) // 100*2 + 50*1
  })

  it('returns 0 for empty cart', () => {
    const { getItemCount, getTotal } = useCartStore.getState()
    expect(getItemCount()).toBe(0)
    expect(getTotal()).toBe(0)
  })
})
