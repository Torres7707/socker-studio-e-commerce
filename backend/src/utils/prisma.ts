import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socker_studio'
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
