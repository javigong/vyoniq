import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/budgets(.*)",
  "/api/inquiries(.*)",
  "/api/user(.*)",
  "/api/mcp(.*)",
]);

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
  "/services(.*)",
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/vyoniq-apps",
  "/unsubscribe",
  "/api/blog(.*)",
  "/api/service-pricing",
  "/api/emails/newsletter/unsubscribe",
  "/api/webhooks(.*)",
  "/api/payments/create-checkout-session",
]);

// Define admin routes that require additional permissions
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

// Environment detection
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    // Skip protection for public routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
      try {
        const { userId, sessionClaims } = await auth();

        // Check if user is authenticated
        if (!userId) {
          if (isDevelopment) {
            console.log(`🔒 Authentication required for: ${pathname}`);
          }

          const signInUrl = new URL("/sign-in", req.url);
          signInUrl.searchParams.set("redirect_url", req.url);
          return NextResponse.redirect(signInUrl);
        }

        // Additional check for admin routes
        if (isAdminRoute(req)) {
          const publicMetadata = sessionClaims?.publicMetadata as
            | { role?: string }
            | undefined;
          const isAdmin = publicMetadata?.role === "admin";

          if (!isAdmin) {
            if (isDevelopment) {
              console.log(
                `🚫 Admin access denied for user ${userId} on: ${pathname}`
              );
            }

            // Redirect non-admin users to dashboard
            const dashboardUrl = new URL("/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
          }

          if (isDevelopment) {
            console.log(
              `✅ Admin access granted for user ${userId} on: ${pathname}`
            );
          }
        }

        if (isDevelopment) {
          console.log(
            `✅ Authentication successful for user ${userId} on: ${pathname}`
          );
        }

        return NextResponse.next();
      } catch (error) {
        // Enhanced error logging
        console.error("🔥 Clerk middleware error:", {
          error: error instanceof Error ? error.message : "Unknown error",
          pathname,
          timestamp: new Date().toISOString(),
          userAgent: req.headers.get("user-agent"),
          host: req.headers.get("host"),
        });

        // Graceful fallback - redirect to sign-in
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("redirect_url", req.url);
        signInUrl.searchParams.set("error", "auth_error");
        return NextResponse.redirect(signInUrl);
      }
    }

    // Default: allow the request to proceed
    return NextResponse.next();
  },
  {
    // Configure authorized parties based on environment
    // Development: undefined allows localhost and any development domains
    // Production: restrict to specific domains for security
    authorizedParties: isProduction
      ? ["vyoniq.com", "www.vyoniq.com"]
      : undefined, // This allows localhost:3000, localhost:3001, etc.

    // Enable debug mode in development for better error messages
    debug: isDevelopment,
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
