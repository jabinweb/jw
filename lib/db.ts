import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

// PrismaClient is attached to `globalThis` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prismaClientSingleton()
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton()
  }
}

export const db = globalForPrisma.prisma as PrismaClient
