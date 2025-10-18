// middleware.ts
import { auth } from "@/services/auth"; // Import 'auth' without renaming
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The auth() function from @/services/auth is now the NextAuth.js middleware
export default auth((req) => {
  // Your custom middleware logic can go here.
  // For example, you can check req.auth to see if the user is authenticated.
  // The auth() wrapper already handles the session logic.
  
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protect the /dashboard route
  if (pathname.startsWith('/') && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in, redirect from /login to /dashboard
  if (pathname === '/login' && isLoggedIn) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
});


// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};







// //middleware.ts
// import { auth as middleware } from "@/services/auth";

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   // 1. Get the session token from cookies
//   const sessionToken = request.cookies.get('auth_token')?.value;

//   // 2. Redirect to /login if there's no token and the user is trying to access a protected route
//   if (!sessionToken && request.nextUrl.pathname.startsWith('/dashboard')) {
//     const loginUrl = new URL('/login', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // 3. If a user is logged in, redirect them from the login page to the dashboard
//   if (sessionToken && request.nextUrl.pathname === '/login') {
//      const dashboardUrl = new URL('/dashboard', request.url);
//      return NextResponse.redirect(dashboardUrl);
//   }

//   // 4. If none of the above, continue to the requested page
//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };