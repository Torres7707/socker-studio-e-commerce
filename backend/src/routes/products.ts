import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma'
import { ProductQuerySchema, CreateReviewSchema, ProductQueryInput, CreateReviewInput } from '../schemas'

export default async function productRoutes(fastify: FastifyInstance) {
  // Get products with filtering, sorting, and pagination
  fastify.get('/', async (request: FastifyRequest<{ Querystring: ProductQueryInput }>, reply: FastifyReply) => {
    try {
      const query = ProductQuerySchema.parse(request.query)
      
      const where: any = {}
      
      // Category filter
      if (query.category && query.category !== 'All') {
        where.category = query.category
      }
      
      // Search filter
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ]
      }
      
      // Price filter
      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        where.price = {}
        if (query.minPrice !== undefined) {
          where.price.gte = query.minPrice
        }
        if (query.maxPrice !== undefined) {
          where.price.lte = query.maxPrice
        }
      }
      
      // Rating filter
      if (query.minRating !== undefined) {
        where.rating = { gte: query.minRating }
      }
      
      // Sorting
      let orderBy: any = { createdAt: 'desc' }
      switch (query.sortBy) {
        case 'price-asc':
          orderBy = { price: 'asc' }
          break
        case 'price-desc':
          orderBy = { price: 'desc' }
          break
        case 'rating':
          orderBy = { rating: 'desc' }
          break
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        default:
          orderBy = { createdAt: 'desc' }
      }
      
      // Pagination
      const skip = (query.page - 1) * query.limit
      
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: query.limit,
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            originalPrice: true,
            image: true,
            category: true,
            rating: true,
            reviews: true,
            inStock: true,
            createdAt: true
          }
        }),
        prisma.product.count({ where })
      ])
      
      return reply.send({
        products,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages: Math.ceil(total / query.limit)
        }
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid query parameters'
      })
    }
  })
  
  // Get product by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params
      
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          reviewsList: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
      
      if (!product) {
        return reply.status(404).send({
          error: 'Product not found',
          message: 'Product with the specified ID does not exist'
        })
      }
      
      return reply.send(product)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching the product'
      })
    }
  })
  
  // Get product reviews
  fastify.get('/:id/reviews', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params

      const reviews = await prisma.review.findMany({
        where: { productId: id },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })

      // Map createdAt to date for frontend compatibility
      const mappedReviews = reviews.map(review => ({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        userName: review.user?.name || 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt.toISOString(),
        helpful: review.helpful,
      }))

      return reply.send(mappedReviews)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching reviews'
      })
    }
  })
  
  // Add review to product
  fastify.post('/:id/reviews', async (request: FastifyRequest<{ Params: { id: string }; Body: CreateReviewInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      const body = CreateReviewSchema.parse(request.body)
      
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id }
      })
      
      if (!product) {
        return reply.status(404).send({
          error: 'Product not found',
          message: 'Product with the specified ID does not exist'
        })
      }
      
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }
      })
      
      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found'
        })
      }
      
      // Create review
      const review = await prisma.review.create({
        data: {
          productId: id,
          userId,
          userName: user.name,
          rating: body.rating,
          comment: body.comment
        }
      })

      // Update product rating and review count
      const reviews = await prisma.review.findMany({
        where: { productId: id }
      })

      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      await prisma.product.update({
        where: { id },
        data: {
          rating: averageRating,
          reviews: reviews.length
        }
      })

      // Map to frontend format
      const mappedReview = {
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt.toISOString(),
        helpful: review.helpful,
      }

      return reply.status(201).send(mappedReview)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Mark review as helpful
  fastify.post('/:id/reviews/:reviewId/helpful', async (request: FastifyRequest<{ Params: { id: string; reviewId: string } }>, reply: FastifyReply) => {
    try {
      const { reviewId } = request.params
      
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          helpful: { increment: 1 }
        }
      })
      
      return reply.send(review)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while updating the review'
      })
    }
  })
}