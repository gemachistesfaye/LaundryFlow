import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // All dashboard routes need protection
  const protectedPrefixes = [
    "/dashboard/student",
    "/dashboard/worker",
    "/dashboard/admin",
    "/dashboard/coordinator",
    "/dashboard/deliverer",
  ];

  // Skip protection if not a dashboard route
  if (!protectedPrefixes.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  // Get JWT from header or cookies
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.get("token")?.value;

  if (!token) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const role = payload.role;

    if (!role) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // ROLE VALIDATION
    if (pathname.startsWith("/dashboard/student") && role !== "student") {
      url.pathname = "/auth/forbidden";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/worker") && role !== "worker") {
      url.pathname = "/auth/forbidden";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      url.pathname = "/auth/forbidden";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/coordinator") && role !== "coordinator") {
      url.pathname = "/auth/forbidden";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/deliverer") && role !== "delivery") {
      url.pathname = "/auth/forbidden";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
