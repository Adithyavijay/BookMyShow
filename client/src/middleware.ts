// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

// Function to validate the admin token
async function validateAdminToken(cookieValue: string): Promise<boolean> {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/validate-token', {
      headers: {
        Cookie: `adminToken=${cookieValue}`
      }
    });

    console.log('Token validation response:', response.data);
    return response.data.isValid;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error validating token:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error during token validation:', error);
    }
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('adminToken')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isExactAdminRoute = request.nextUrl.pathname === '/admin';

  let isValidToken = false;
  if (adminToken) {
    isValidToken = await validateAdminToken(adminToken);
  }
  console.log(isValidToken);

  // Handle the exact '/admin' route
  if (isExactAdminRoute) {
    if (isValidToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle other admin routes
  if (isAdminRoute && !isValidToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
 
  if (isLoginPage && isValidToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } 


  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};