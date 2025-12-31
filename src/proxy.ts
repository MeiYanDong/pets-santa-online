import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

// Public API routes that don't require authentication (e.g., webhooks)
const publicApiRoutes = ["/api/webhook"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = getSessionCookie(request);

  // Allow public API routes (webhooks, etc.) without authentication
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  const isApiAuth = pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthRoute = () => {
    return authRoutes.some((path) => pathname.startsWith(path));
  };

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (isAuthRoute()) {
    if (session) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );
    }
    return NextResponse.next();
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
