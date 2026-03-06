import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// OFFLINE MODE: No authentication required
// All routes are accessible without login

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to /app/pos (main sales page)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/app/pos", request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)",
  ],
}
