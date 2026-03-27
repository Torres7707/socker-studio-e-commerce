import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  getCount: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (productId) => {
        set((state) => ({
          favorites: [...state.favorites, productId],
        }))
      },

      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }))
      },

      toggleFavorite: (productId) => {
        const { favorites, addFavorite, removeFavorite } = get()
        if (favorites.includes(productId)) {
          removeFavorite(productId)
        } else {
          addFavorite(productId)
        }
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId)
      },

      getCount: () => {
        return get().favorites.length
      },
    }),
    {
      name: 'scandinavian_shop_favorites',
    }
  )
)