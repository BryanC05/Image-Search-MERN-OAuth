// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; //

export async function middleware(request: NextRequest) {
  const session = await getSession(); //
  const pathname = request.nextUrl.pathname; //

  // Protect dashboard and profile routes
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) && !session) { //
    return NextResponse.redirect(new URL("/login", request.url)); //
  }

  // Redirect authenticated users away from login
  if (pathname === "/login" && session) { //
    return NextResponse.redirect(new URL("/dashboard", request.url)); //
  }

  return NextResponse.next(); //
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"], // Added /profile/:path*
}; //