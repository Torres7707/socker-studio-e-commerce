import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma'
import { CreateOrderSchema, UpdateOrderStatusSchema, CreateOrderInput, UpdateOrderStatusInput } from '../schemas'

export default async function orderRoutes(fastify: FastifyInstance) {
  // Create order
  fastify.post('/', async (request: FastifyRequest<{ Body: CreateOrderInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const body = CreateOrderSchema.parse(request.body)
      
      // Get user's cart items
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: true
        }
      })
      
      if (cartItems.length === 0) {
        return reply.status(400).send({
          error: 'Empty cart',
          message: 'Cannot create order with empty cart'
        })
      }
      
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      const shipping = subtotal > 100 ? 0 : 9.99
      const tax = subtotal * 0.08
      const total = subtotal + shipping + tax
      
      // Create order with items and shipping address
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          shipping,
          tax,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          },
          shippingAddress: {
            create: body.shippingAddress
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          shippingAddress: true
        }
      })
      
      // Clear user's cart
      await prisma.cartItem.deleteMany({
        where: { userId }
      })
      
      return reply.status(201).send(order)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Get user's orders
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true
            }
          },
          shippingAddress: true
        }
      })
      
      return reply.send(orders)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching orders'
      })
    }
  })
  
  // Get order by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      
      const order = await prisma.order.findFirst({
        where: {
          id,
          userId
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          shippingAddress: true
        }
      })
      
      if (!order) {
        return reply.status(404).send({
          error: 'Order not found',
          message: 'Order with the specified ID does not exist'
        })
      }
      
      return reply.send(order)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching the order'
      })
    }
  })
  
  // Update order status
  fastify.patch('/:id/status', async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateOrderStatusInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      const body = UpdateOrderStatusSchema.parse(request.body)
      
      // Check if order exists and belongs to user
      const existingOrder = await prisma.order.findFirst({
        where: {
          id,
          userId
        }
      })
      
      if (!existingOrder) {
        return reply.status(404).send({
          error: 'Order not found',
          message: 'Order with the specified ID does not exist'
        })
      }
      
      // Update order status
      const order = await prisma.order.update({
        where: { id },
        data: { status: body.status },
        include: {
          items: {
            include: {
              product: true
            }
          },
          shippingAddress: true
        }
      })
      
      return reply.send(order)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
}
