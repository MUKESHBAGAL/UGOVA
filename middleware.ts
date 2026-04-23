import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/schemes', '/exams', '/jobs', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin routes - require admin role
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (isAdminRoute && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/apply/:path*',
  ]
}
