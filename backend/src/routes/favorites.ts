import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma'

export default async function favoriteRoutes(fastify: FastifyInstance) {
  // Get user's favorites
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as { userId: string }).userId
      
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          product: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      return reply.send(favorites.map(fav => fav.product))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching favorites'
      })
    }
  })
  
  // Add to favorites
  fastify.post('/:productId', async (request: FastifyRequest<{ Params: { productId: string }; Body: {} }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as { userId: string }).userId
      
      const { productId } = request.params
      
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })
      
      if (!product) {
        return reply.status(404).send({
          error: 'Product not found',
          message: 'Product with the specified ID does not exist'
        })
      }
      
      // Check if already in favorites
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      
      if (existingFavorite) {
        return reply.status(400).send({
          error: 'Already in favorites',
          message: 'Product is already in your favorites'
        })
      }
      
      // Add to favorites
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          productId
        },
        include: {
          product: true
        }
      })
      
      return reply.status(201).send(favorite.product)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while adding to favorites'
      })
    }
  })
  
  // Remove from favorites
  fastify.delete('/:productId', async (request: FastifyRequest<{ Params: { productId: string } }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as { userId: string }).userId
      
      const { productId } = request.params
      
      // Check if favorite exists
      const existingFavorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      
      if (!existingFavorite) {
        return reply.status(404).send({
          error: 'Not in favorites',
          message: 'Product is not in your favorites'
        })
      }
      
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      
      return reply.send({ message: 'Removed from favorites successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while removing from favorites'
      })
    }
  })
  
  // Check if product is in favorites
  fastify.get('/check/:productId', async (request: FastifyRequest<{ Params: { productId: string } }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as { userId: string }).userId
      
      const { productId } = request.params
      
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      
      return reply.send({ isFavorite: !!favorite })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while checking favorite status'
      })
    }
  })
}