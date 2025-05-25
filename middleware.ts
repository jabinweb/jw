import { auth } from "@/auth"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Early return if this is not an oauth callback
  if (!request.nextUrl.pathname.startsWith('/api/auth/callback')) {
    return NextResponse.next();
  }

  const currentHost = request.headers.get('host') || 'localhost:3000';
  
  // Detect if we're running in a production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // If we're in production but still using localhost, redirect to the proper domain
  if (isProduction && currentHost.includes('localhost')) {
    const productionHost = process.env.NEXTAUTH_URL || request.headers.get('x-forwarded-host') || currentHost;
    
    // Clone the URL and update the host
    const url = request.nextUrl.clone();
    url.host = productionHost.replace(/https?:\/\//, '');
    url.protocol = 'https';
    
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

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