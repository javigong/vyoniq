import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes using createRouteMatcher
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/budgets(.*)",
  "/api/inquiries(.*)",
  "/api/user(.*)",
  "/api/mcp(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle problematic Clerk handshake requests
  if (req.nextUrl.searchParams.has("__clerk_handshake")) {
    // Clear the handshake parameter and redirect to clean URL
    const url = new URL(req.url);
    url.searchParams.delete("__clerk_handshake");

    // If it's the homepage, redirect to clean homepage
    if (url.pathname === "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Otherwise redirect to the clean URL
    return NextResponse.redirect(url);
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    try {
      await auth.protect();
    } catch (error) {
      // If auth fails, redirect to sign-in instead of throwing error
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
