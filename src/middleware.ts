import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthenticated = request.cookies.get('sg_auth')?.value === 'true';

  // Unauthenticated user trying to access a protected page → redirect to login
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged-in user hitting /login → redirect to dashboard
  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run on actual page routes — never on Next.js internals or static files
export const config = {
  matcher: [
    '/((?!_next|api|favicon\\.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp|icons).*)',
  ],
};
