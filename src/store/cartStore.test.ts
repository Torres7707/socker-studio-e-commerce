import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import { type Product } from '@/schemas'

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
    useCartStore.setState({ items: [] })
  })

  it('starts with empty cart', () => {
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('adds item to cart', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockProduct)
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('1')
    expect(items[0].quantity).toBe(1)
  })

  it('increments quantity when adding same product', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct)
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('adds different products separately', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct2)
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(2)
  })

  it('removes item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState()
    
    addItem(mockProduct)
    removeItem('1')
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('updates item quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(mockProduct)
    updateQuantity('1', 5)
    
    const { items } = useCartStore.getState()
    expect(items[0].quantity).toBe(5)
  })

  it('removes item when quantity is less than 1', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(mockProduct)
    updateQuantity('1', 0)
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('clears cart', () => {
    const { addItem, clearCart } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct2)
    clearCart()
    
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('calculates item count correctly', () => {
    const { addItem, getItemCount } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct)
    addItem(mockProduct2)
    
    expect(getItemCount()).toBe(3)
  })

  it('calculates total correctly', () => {
    const { addItem, getTotal } = useCartStore.getState()
    
    addItem(mockProduct) // 100
    addItem(mockProduct) // 100
    addItem(mockProduct2) // 50
    
    expect(getTotal()).toBe(250)
  })

  it('returns 0 for empty cart', () => {
    const { getItemCount, getTotal } = useCartStore.getState()
    
    expect(getItemCount()).toBe(0)
    expect(getTotal()).toBe(0)
  })
})