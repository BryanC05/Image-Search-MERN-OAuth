import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "your-secret-key-change-this")

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return false

  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const isAuthenticated = await hasValidSession(request)
  const pathname = request.nextUrl.pathname

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from login
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
