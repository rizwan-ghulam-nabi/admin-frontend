// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const { pathname } = request.nextUrl;
  
//   const publicPaths = ['/login', '/verify-otp', '/verify-2fa'];
//   const isPublicPath = publicPaths.includes(pathname);
  
//   const token = request.cookies.get('accessToken')?.value;
  
//   if (!isPublicPath && !token) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(loginUrl);
//   }
  
//   if (isPublicPath && token && pathname === '/login') {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }
  
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
// // }
// ;











import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register'];
  const otpPaths = ['/verify-otp', '/verify-2fa'];

  const isPublicPath = publicPaths.includes(pathname);
  const isOtpPath = otpPaths.includes(pathname);

  const token = request.cookies.get('accessToken')?.value;
  const isVerified = request.cookies.get('is2FAVerified')?.value;

  // 1️⃣ Not logged in → only allow login/register
  if (!token) {
    if (!isPublicPath) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2️⃣ Logged in but NOT verified → only allow OTP pages
  if (token && !isVerified) {
    if (!isOtpPath) {
      return NextResponse.redirect(new URL('/verify-otp', request.url));
    }
    return NextResponse.next();
  }

  // 3️⃣ Logged in + verified → block auth pages
  if (token && isVerified) {
    if (isPublicPath || isOtpPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
};