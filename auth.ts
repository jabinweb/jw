import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

// Fix: Add better URL detection for production environment
function getBaseUrl() {
  // Check for NEXTAUTH_URL in environment - highest priority
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Check if we're in a Vercel environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for other common production environment variables
  if (process.env.URL) {
    return process.env.URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
}

export const { auth, handlers } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login?error=true', // Add error page
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Ensure role is always set
      if (!token.role) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true }
        })
        token.role = dbUser?.role || UserRole.user
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth session URL:', getBaseUrl());
      }
      
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    authorized: async ({ auth, request }) => {
      const isAuth = !!auth
      const isApiRoute = request.nextUrl?.pathname.startsWith('/api')
      const isAdminRoute = request.nextUrl?.pathname.startsWith('/admin')

      if (isApiRoute) return isAuth
      if (isAdminRoute) return isAuth && auth?.user?.role === 'admin'
      
      return true
    },
    async signIn({ user }) {
      try {
        const dbUser = await db.user.findUnique({
          where: { email: user.email ?? undefined }
        })

        if (dbUser) {
          // Update existing user
          await db.user.update({
            where: { id: dbUser.id },
            data: {
              name: user.name,
              image: user.image,
            }
          })
          user.role = dbUser.role // Set role from database
          return true
        }

        // Create new user
        const isFirstUser = await db.user.count() === 0
        const newUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: isFirstUser ? UserRole.admin : UserRole.user
          }
        })
        user.role = newUser.role // Set role from new user
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      // Ensure correct redirect URL in production
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add proper error handling
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials")
          }

          throw new Error("Invalid credentials")
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),
  ]
})

export type Auth = typeof auth