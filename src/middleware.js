import { clerkMiddleware } from "@clerk/nextjs/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return clerkMiddleware()(req);
  }

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (pathname.startsWith("/admin")) {
    if (!token && !["/admin/login", "/admin/signUp"].includes(pathname)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (token && pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (token && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/admin/:path*",
  ],
};
