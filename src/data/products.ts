import { type Product } from '@/schemas'
import { productsApi } from '@/lib/api'

// Re-export Product type for backward compatibility
export type { Product }

// Categories
export const categories = [
  'All',
  'Home Textiles',
  'Furniture',
  'Lighting',
  'Decor',
  'Storage',
]

// API functions to fetch products
export const getProducts = async (params?: {
  page?: number
  limit?: number
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: string
}) => {
  return productsApi.getProducts(params)
}

export const getProduct = async (id: string) => {
  return productsApi.getProduct(id)
}

// For backward compatibility, keep the products array but make it empty
// The actual data should be fetched from the API
export const products: Product[] = []
