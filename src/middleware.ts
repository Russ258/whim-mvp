import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin — must have whim_role=admin cookie
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("whim_role")?.value;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /salon — must have whim_salon_id cookie
  // But allow /salon/login and /salon/verify (public entry points)
  if (
    pathname.startsWith("/salon") &&
    !pathname.startsWith("/salon/login") &&
    !pathname.startsWith("/salon/verify")
  ) {
    const salonId = request.cookies.get("whim_salon_id")?.value;
    if (!salonId) {
      return NextResponse.redirect(new URL("/salon/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/salon/:path*"],
};
