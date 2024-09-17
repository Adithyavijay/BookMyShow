// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {  
  
  const adminToken = request.cookies.get('adminToken');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isExactAdminRoute = request.nextUrl.pathname === '/admin';

  // Handle the exact '/admin' route
  if (isExactAdminRoute) {
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle other admin routes
  if (isAdminRoute && !adminToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
 
  if (isLoginPage && adminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};