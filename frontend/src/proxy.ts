import { NextRequest, NextResponse } from "next/server";
import { getTokenCookie, getUserData } from "@/lib/cookies";
const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/dashboard", "/admin"];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getTokenCookie();
  const user = await getUserData();
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url)); // redirect to /login
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (token && user) {
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // if already logged in restrict login/register
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url)); // redirect to /
  }

  return NextResponse.next(); // continue
}
// apply to whatever path you want to proxy
export const config = {
  matcher: [
    "/dashboard",
    "/register",
    "/login",
    "/admin/:path*", // all admin routes
  ],
};
