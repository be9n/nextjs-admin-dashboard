import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./config/routes";
import { getAccessToken, removeAccessToken } from "./actions/auth";

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

  return NextResponse.next();
}

export const config = {
  // Match all paths except for:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public files (public directory)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
