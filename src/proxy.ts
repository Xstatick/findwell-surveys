import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, sessionToken, tokensMatch } from "@/lib/auth";

// Gate the /admin area behind the shared admin password. The login page and the
// login/logout API routes are always reachable so an unauthenticated admin can
// get in. Everything else under /admin redirects to the login page.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  let authed = false;
  try {
    authed = tokensMatch(cookie, await sessionToken());
  } catch {
    authed = false; // ADMIN_PASSWORD not configured
  }

  if (!authed) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
