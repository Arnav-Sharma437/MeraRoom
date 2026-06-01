import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { UserRole } from '@/models/User';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Fallback redirect to /login if token is missing (normally handled by authorized callback)
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const role = (token.role as UserRole) ?? 'user';
    const path = req.nextUrl.pathname;

    // Handle direct /dashboard access
    if (path === '/dashboard') {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', req.url));
      if (role === 'owner') return NextResponse.redirect(new URL('/dashboard/owner', req.url));
      return NextResponse.redirect(new URL('/', req.url));
    }

    // /admin/* -> admin only
    if (path.startsWith('/admin')) {
      if (role !== 'admin') {
        // others -> /
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    // /dashboard/owner/* -> owner + admin
    if (path.startsWith('/dashboard/owner')) {
      if (role !== 'owner' && role !== 'admin') {
        if (role === 'user') {
          // user tries /dashboard/owner -> /
          return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    // /dashboard/user/* -> user + admin
    if (path.startsWith('/dashboard/user')) {
      if (role !== 'user' && role !== 'admin') {
        if (role === 'owner') {
          // owner tries /dashboard/user -> /dashboard/owner
          return NextResponse.redirect(new URL('/dashboard/owner', req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard', '/dashboard/:path*'],
};
