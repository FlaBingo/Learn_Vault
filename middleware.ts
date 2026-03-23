// middleware.ts
import { auth } from "@/services/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. Define public routes that don't need protection
  const isPublicRoute = pathname === '/login' || pathname === '/'; 
  // You might want the landing page (/) to be public too.

  // 2. Fix the Redirect Loop
  // Only redirect to login if it's NOT a public route and user isn't logged in
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent logged-in users from visiting the login page
  if (isLoggedIn && pathname === '/login') {
    const dashboardUrl = new URL('/my-repos', req.url); // Or /dashboard
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth internal routes)
     * - _next/static, _next/image, favicon.ico
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};