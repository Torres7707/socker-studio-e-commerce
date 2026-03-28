import { z } from 'zod'

// User schemas
export const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100),
})

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  photoURL: z.string().url().optional(),
})

// Address schemas
export const CreateAddressSchema = z.object({
  name: z.string().min(1).max(100),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100).default('United States'),
  isDefault: z.boolean().default(false),
})

export const UpdateAddressSchema = CreateAddressSchema.partial()

// Product schemas
export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'rating', 'newest', 'default']).default('default'),
})

// Review schemas
export const CreateReviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().min(1).max(1000),
})

// Order schemas
export const CreateOrderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().min(1).max(20),
    address: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    zipCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100).default('United States'),
  }),
})

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

// Cart schemas
export const AddToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
})

export const UpdateCartSchema = z.object({
  quantity: z.number().int().positive(),
})

// Type exports
export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>
export type AddToCartInput = z.infer<typeof AddToCartSchema>
export type UpdateCartInput = z.infer<typeof UpdateCartSchema>