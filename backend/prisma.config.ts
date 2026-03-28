import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  engineType: 'classic',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://torreswang@localhost:5432/socker_studio'
  },
  migrate: {
    async development() {
      return {
        url: process.env.DATABASE_URL || 'postgresql://torreswang@localhost:5432/socker_studio'
      }
    }
  }
})
