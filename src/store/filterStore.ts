import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FilterState {
  priceRange: [number, number]
  minRating: number
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
  selectedCategories: string[]
  searchHistory: string[]
  popularSearches: string[]
}

interface FilterActions {
  setPriceRange: (range: [number, number]) => void
  setMinRating: (rating: number) => void
  setSortBy: (sort: FilterState['sortBy']) => void
  setSelectedCategories: (categories: string[]) => void
  toggleCategory: (category: string) => void
  clearFilters: () => void
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  getSearchSuggestions: (query: string) => string[]
}

const initialState: FilterState = {
  priceRange: [0, 500],
  minRating: 0,
  sortBy: 'default',
  selectedCategories: [],
  searchHistory: [],
  popularSearches: ['Nordic', 'Minimalist', 'Wood', 'Ceramic', 'Wool', 'Linen'],
}

export const useFilterStore = create<FilterState & FilterActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPriceRange: (range) => set({ priceRange: range }),

      setMinRating: (rating) => set({ minRating: rating }),

      setSortBy: (sort) => set({ sortBy: sort }),

      setSelectedCategories: (categories) => set({ selectedCategories: categories }),

      toggleCategory: (category) => {
        const { selectedCategories } = get()
        if (selectedCategories.includes(category)) {
          set({
            selectedCategories: selectedCategories.filter((c) => c !== category),
          })
        } else {
          set({
            selectedCategories: [...selectedCategories, category],
          })
        }
      },

      clearFilters: () =>
        set({
          priceRange: [0, 500],
          minRating: 0,
          sortBy: 'default',
          selectedCategories: [],
        }),

      addSearchHistory: (query) => {
        if (!query.trim()) return
        const { searchHistory } = get()
        const filtered = searchHistory.filter((q) => q !== query)
        set({
          searchHistory: [query, ...filtered].slice(0, 10),
        })
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      getSearchSuggestions: (query) => {
        const { searchHistory, popularSearches } = get()
        if (!query.trim()) return popularSearches.slice(0, 5)
        
        const historyMatches = searchHistory.filter((q) =>
          q.toLowerCase().includes(query.toLowerCase())
        )
        const popularMatches = popularSearches.filter((q) =>
          q.toLowerCase().includes(query.toLowerCase())
        )
        
        return [...new Set([...historyMatches, ...popularMatches])].slice(0, 5)
      },
    }),
    {
      name: 'scandinavian_shop_filters',
    }
  )
)