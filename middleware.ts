import { auth } from "@/auth"

export default auth((req) => {
  console.log('[Middleware]', {
    path: req.nextUrl.pathname,
    auth: !!req.auth,
    userId: req.auth?.user?.id,
    role: req.auth?.user?.role
  })

  const isAuthenticated = !!req.auth?.user?.id
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (!isAuthenticated && (isAdminRoute || isApiRoute)) {
    if (isApiRoute) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  if (isAdminRoute && req.auth?.user?.role !== 'admin') {
    return Response.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: [
    "/api/posts/:path*",
    "/admin/:path*"
  ]
}