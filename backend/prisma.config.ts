import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    async development() {
      return {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socker_studio'
      }
    }
  }
})
