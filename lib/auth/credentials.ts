import { db } from "@/lib/db"
import { compareSync } from "bcrypt"
import type { User } from "next-auth"
import { PrismaClient } from "@prisma/client"

export async function validateCredentials(
  email: string | null | undefined, 
  password: string | null | undefined
): Promise<User | null> {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    })

    if (!dbUser?.password) return null
    if (!compareSync(password, dbUser.password)) return null

    const { password: _, ...user } = dbUser
    return user as User
  } catch (error) {
    console.error('Credentials validation error:', error)
    return null
  }
}
