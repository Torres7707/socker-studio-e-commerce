import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { prisma } from './utils/prisma'

const fastify = Fastify({
  logger: true
})

// Register plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set')
  process.exit(1)
}

fastify.register(jwt, {
  secret: process.env.JWT_SECRET
})

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Import routes
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import userRoutes from './routes/users'
import cartRoutes from './routes/cart'
import favoriteRoutes from './routes/favorites'

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(productRoutes, { prefix: '/api/products' })
fastify.register(orderRoutes, { prefix: '/api/orders' })
fastify.register(userRoutes, { prefix: '/api/users' })
fastify.register(cartRoutes, { prefix: '/api/cart' })
fastify.register(favoriteRoutes, { prefix: '/api/favorites' })

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'
    
    await fastify.listen({ port, host })
    console.log(`Server running on http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()