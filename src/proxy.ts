import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all child routes at the server/proxy level
  if (pathname.startsWith('/dashboard')) {
    const isLoggedIn =
      request.cookies.get('otp_is_logged_in')?.value === 'true' ||
      Boolean(request.cookies.get('otp_auth_token')?.value);

    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect away from /auth/login or /auth/register
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    const isLoggedIn =
      request.cookies.get('otp_is_logged_in')?.value === 'true' ||
      Boolean(request.cookies.get('otp_auth_token')?.value);

    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard/buy-number', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register'],
};

