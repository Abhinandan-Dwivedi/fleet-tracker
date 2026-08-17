import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  // Not logged in, trying to access protected routes → redirect to login
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in, but a CUSTOMER trying to access staff-only dashboard routes
  const staffOnlyRoutes = ["/dashboard/drivers", "/dashboard/deliveries"];
  const isStaffRoute = staffOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isLoggedIn && role === "CUSTOMER" && isStaffRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Already logged in, trying to visit the login page again → send to dashboard
 if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};