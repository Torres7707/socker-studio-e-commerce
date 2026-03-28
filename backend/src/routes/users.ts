import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma'
import { UpdateProfileSchema, CreateAddressSchema, UpdateAddressSchema, UpdateProfileInput, CreateAddressInput, UpdateAddressInput } from '../schemas'

export default async function userRoutes(fastify: FastifyInstance) {
  // Get user profile
  fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          photoURL: true,
          provider: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
          message: 'User not found'
        })
      }
      
      return reply.send(user)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching user profile'
      })
    }
  })
  
  // Update user profile
  fastify.put('/profile', async (request: FastifyRequest<{ Body: UpdateProfileInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const body = UpdateProfileSchema.parse(request.body)
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: body,
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          photoURL: true,
          provider: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return reply.send(user)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Get user addresses
  fastify.get('/addresses', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      
      return reply.send(addresses)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while fetching addresses'
      })
    }
  })
  
  // Add address
  fastify.post('/addresses', async (request: FastifyRequest<{ Body: CreateAddressInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const body = CreateAddressSchema.parse(request.body)
      
      // If this is set as default, unset other default addresses
      if (body.isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        })
      }
      
      const address = await prisma.address.create({
        data: {
          userId,
          ...body
        }
      })
      
      return reply.status(201).send(address)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Update address
  fastify.put('/addresses/:id', async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateAddressInput }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      const body = UpdateAddressSchema.parse(request.body)
      
      // Check if address exists and belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id,
          userId
        }
      })
      
      if (!existingAddress) {
        return reply.status(404).send({
          error: 'Address not found',
          message: 'Address with the specified ID does not exist'
        })
      }
      
      // If this is set as default, unset other default addresses
      if (body.isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        })
      }
      
      const address = await prisma.address.update({
        where: { id },
        data: body
      })
      
      return reply.send(address)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Delete address
  fastify.delete('/addresses/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      // Verify JWT token
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      const { id } = request.params
      
      // Check if address exists and belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id,
          userId
        }
      })
      
      if (!existingAddress) {
        return reply.status(404).send({
          error: 'Address not found',
          message: 'Address with the specified ID does not exist'
        })
      }
      
      await prisma.address.delete({
        where: { id }
      })
      
      return reply.send({ message: 'Address deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while deleting the address'
      })
    }
  })
}
