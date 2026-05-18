import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../utils/prisma'
import { RegisterSchema, LoginSchema, RegisterInput, LoginInput } from '../schemas'

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) => {
    try {
      const body = RegisterSchema.parse(request.body)
      
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: body.email },
            { username: body.username }
          ]
        }
      })
      
      if (existingUser) {
        return reply.status(400).send({
          error: 'User already exists',
          message: 'A user with this email or username already exists'
        })
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(body.password, 12)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          passwordHash,
          name: body.name,
          provider: 'credentials'
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          photoURL: true,
          provider: true,
          createdAt: true
        }
      })
      
      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '24h' })

      return reply.status(201).send({
        user,
        token
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Login
  fastify.post('/login', async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
    try {
      const body = LoginSchema.parse(request.body)
      
      // Find user by username or email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: body.username },
            { email: body.username }
          ]
        }
      })
      
      if (!user || !user.passwordHash) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        })
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(body.password, user.passwordHash)
      
      if (!isValidPassword) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        })
      }
      
      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '24h' })

      return reply.send({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          photoURL: user.photoURL,
          provider: user.provider,
          createdAt: user.createdAt
        },
        token
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(400).send({
        error: 'Validation error',
        message: 'Invalid input data'
      })
    }
  })
  
  // Logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage
    return reply.send({ message: 'Logged out successfully' })
  })
  
  // Refresh token
  fastify.post('/refresh-token', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
      const userId = (request.user as any).userId
      
      // Generate new token
      const token = fastify.jwt.sign({ userId }, { expiresIn: '24h' })
      
      return reply.send({ token })
    } catch (error) {
      return reply.status(401).send({
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      })
    }
  })
  
  // Forgot password
  fastify.post('/forgot-password', async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    try {
      const { email } = request.body
      
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (!user) {
        // Don't reveal if user exists or not
        return reply.send({ message: 'If an account with that email exists, a password reset link has been sent' })
      }
      
      // In a real application, you would:
      // 1. Generate a password reset token
      // 2. Send an email with the reset link
      // 3. Store the token in the database with expiration
      
      // For now, just return success message
      return reply.send({ message: 'If an account with that email exists, a password reset link has been sent' })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Server error',
        message: 'An error occurred while processing your request'
      })
    }
  })
}