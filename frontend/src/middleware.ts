import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
// Note: /profil est PUBLIC pour le SEO (Google doit pouvoir indexer les profils)
export const protectedRoutes = ['/recherche', '/conversation', '/mon-profil'];

// Routes that should redirect to /recherche if already authenticated
export const authRoutes = ['/connexion', '/inscription'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check for auth token in cookies
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = !!refreshToken;

  // Check if current path matches protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to /recherche or the previous route if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    const fallbackRedirect = searchParams.get('redirect') || '/recherche';
    return NextResponse.redirect(new URL(fallbackRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
