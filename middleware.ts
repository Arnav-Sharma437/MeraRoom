import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { UserRole } from '@/models/User';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = (token?.role as UserRole) ?? 'user';
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin')) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith('/dashboard/owner')) {
      if (role === 'user') {
        return NextResponse.redirect(new URL('/dashboard/user', req.url));
      }
      if (role !== 'owner' && role !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith('/dashboard/user')) {
      if (role === 'owner') {
        return NextResponse.redirect(new URL('/dashboard/owner', req.url));
      }
      if (role !== 'user' && role !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    if (path === '/dashboard' || path.startsWith('/dashboard/')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
