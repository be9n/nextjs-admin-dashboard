import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./config/routes";
import { getAccessToken, removeAccessToken } from "./actions/auth";
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Middleware handler function
export async function middleware(request: NextRequest) {
  const token = await getAccessToken();
  const currentPath = request.nextUrl.pathname;

  const isAuthPage = AUTH_ROUTES.some((p) => currentPath.startsWith(p));
  const isProtectedPage = PROTECTED_ROUTES.some((p) =>
    currentPath.startsWith(p)
  );

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (currentPath.startsWith("/logout")) {
    await removeAccessToken();
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  // If no auth redirects occurred, pass to the intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files and images
  // - Favicon and other public files
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)',]
};
