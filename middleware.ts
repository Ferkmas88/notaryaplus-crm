import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge middleware — we don't verify HMAC here (node crypto not available in edge).
// We only check that the cookie exists; the server component on /dashboard re-verifies.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("notaryaplus_auth");
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
