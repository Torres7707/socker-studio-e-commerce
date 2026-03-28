import { z } from 'zod'

// Product Schema
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  image: z.string(),
  category: z.string(),
  rating: z.number(),
  reviews: z.number(),
  inStock: z.boolean(),
})

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  photoURL: z.string().optional(),
  provider: z.enum(['credentials', 'google', 'github']).optional(),
})

// CartItem Schema
export const CartItemSchema = z.object({
  id: z.string(),
  product: ProductSchema,
  quantity: z.number().int().positive(),
})

// Review Schema
export const ReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  userName: z.string(),
  rating: z.number().min(0).max(5),
  comment: z.string(),
  date: z.string(),
  helpful: z.number().int().nonnegative(),
})

// GeneratorState Schema
export const GeneratorStateSchema = z.enum(['idle', 'loading', 'success', 'error'])

// GenerateResult Schema
export const GenerateResultSchema = z.object({
  markdown: z.string(),
})

// FavoritesState Schema
export const FavoritesStateSchema = z.object({
  favorites: z.array(z.string()),
})

// 类型导出
export type Product = z.infer<typeof ProductSchema>
export type User = z.infer<typeof UserSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type Review = z.infer<typeof ReviewSchema>
export type GeneratorState = z.infer<typeof GeneratorStateSchema>
export type GenerateResult = z.infer<typeof GenerateResultSchema>
export type FavoritesState = z.infer<typeof FavoritesStateSchema>