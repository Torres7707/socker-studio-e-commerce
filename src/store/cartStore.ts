import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Product, type CartItem } from '@/schemas'
import { cartApi } from '@/lib/api'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getItemCount: () => number
  getTotal: () => number
  fetchCart: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        try {
          set({ isLoading: true })
          const cartItems = await cartApi.getCart()
          set({ items: cartItems, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch cart:', error)
          set({ isLoading: false })
        }
      },

      addItem: async (product: Product) => {
        try {
          set({ isLoading: true })
          await cartApi.addToCart(product.id, 1)
          
          // Refresh cart from server
          await get().fetchCart()
        } catch (error) {
          console.error('Failed to add item to cart:', error)
          set({ isLoading: false })
          throw error
        }
      },

      removeItem: async (productId: string) => {
        try {
          set({ isLoading: true })
          
          // Find the cart item to get its ID
          const cartItem = get().items.find(item => item.product.id === productId)
          if (cartItem) {
            await cartApi.removeFromCart(cartItem.id)
          }
          
          // Refresh cart from server
          await get().fetchCart()
        } catch (error) {
          console.error('Failed to remove item from cart:', error)
          set({ isLoading: false })
          throw error
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity < 1) {
          await get().removeItem(productId)
          return
        }
        
        try {
          set({ isLoading: true })
          
          // Find the cart item to get its ID
          const cartItem = get().items.find(item => item.product.id === productId)
          if (cartItem) {
            await cartApi.updateCartItem(cartItem.id, quantity)
          }
          
          // Refresh cart from server
          await get().fetchCart()
        } catch (error) {
          console.error('Failed to update cart item:', error)
          set({ isLoading: false })
          throw error
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true })
          await cartApi.clearCart()
          set({ items: [], isLoading: false })
        } catch (error) {
          console.error('Failed to clear cart:', error)
          set({ isLoading: false })
          throw error
        }
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'scandinavian_shop_cart',
    }
  )
)
