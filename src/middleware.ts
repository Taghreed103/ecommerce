import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Path:', request.nextUrl.pathname)
    console.log('Middleware - Token exists:', !!token)
  }
  
  // Check if user is authenticated (has a valid session)
  if (token) {
    return NextResponse.next()
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Redirecting to login')
  }
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
 
export const config = {
  matcher: ["/cart", "/wishlist", "/allorders/:path*", "/checkout/:path*"]
}