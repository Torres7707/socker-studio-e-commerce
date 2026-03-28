import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma'
import { AddToCartSchema, UpdateCartSchema, AddToCartInput, UpdateCartInput } from '../schemas'

export default async function cartRoutes(fastify: FastifyInstance) {
  // Get user's cart
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true
        },
        orderBy: { createdAt: 'desc' }
      })
      
      return reply.send(cartItems)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching cart items'
      })
    }
  })
  
  // Add to cart
  fastify.post('/', async (request: FastifyRequest<{ Body: AddToCartInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const body = AddToCartSchema.parse(request.body)
      
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: body.productId }
      })
      
      if (!product) {
        return reply.status(404).send({
          error: 'Product not found',
          message: 'Product with the specified ID does not exist'
        })
      }
      
      // Check if item already in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: body.productId
          }
        }
      })
      
      if (existingItem) {
        // Update quantity
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + body.quantity
          },
          include: {
            product: true
          }
        })
        
        return reply.send(updatedItem)
      } else {
        // Create new cart item
        const cartItem = await prisma.cartItem.create({
          data: {
            userId,
            productId: body.productId,
            quantity: body.quantity
          },
          include: {
            product: true
          }
        })
        
        return reply.status(201).send(cartItem)
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Update cart item quantity
  fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateCartInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      const body = UpdateCartSchema.parse(request.body)
      
      // Check if cart item exists and belongs to user
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id,
          userId
        }
      })
      
      if (!existingItem) {
        return reply.status(404).send({
          error: 'Cart item not found',
          message: 'Cart item with the specified ID does not exist'
        })
      }
      
      // Update quantity
      const cartItem = await prisma.cartItem.update({
        where: { id },
        data: {
          quantity: body.quantity
        },
        include: {
          product: true
        }
      })
      
      return reply.send(cartItem)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Remove from cart
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      
      // Check if cart item exists and belongs to user
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          id,
          userId
        }
      })
      
      if (!existingItem) {
        return reply.status(404).send({
          error: 'Cart item not found',
          message: 'Cart item with the specified ID does not exist'
        })
      }
      
      await prisma.cartItem.delete({
        where: { id }
      })
      
      return reply.send({ message: 'Item removed from cart successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while removing item from cart'
      })
    }
  })
  
  // Clear cart
  fastify.delete('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      await prisma.cartItem.deleteMany({
        where: { userId }
      })
      
      return reply.send({ message: 'Cart cleared successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while clearing cart'
      })
    }
  })
}
