import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that should be accessible without authentication
// Everything else will be protected by default
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services(.*)",
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/vyoniq-apps",
  "/unsubscribe",
  "/sign-in(.*)",
  "/sign-up(.*)",
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

// Helper function to get the base URL for the current request
function getBaseUrl(request: Request): string {
  const host = request.headers.get("host") || "";
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    const baseUrl = getBaseUrl(req);

    // Allow public routes without authentication
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // All other routes require authentication
    try {
      const { userId, sessionClaims } = await auth();

      // Check if user is authenticated
      if (!userId) {
        if (isDevelopment) {
          console.log(`🔒 Authentication required for: ${pathname}`);
          console.log(`🌐 Base URL: ${baseUrl}`);
        }

        // Use the current domain for redirect URLs
        const signInUrl = new URL("/sign-in", baseUrl);
        signInUrl.searchParams.set("redirect_url", `${baseUrl}${pathname}`);
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

          // Redirect non-admin users to dashboard using current domain
          const dashboardUrl = new URL("/dashboard", baseUrl);
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
        baseUrl,
      });

      // Graceful fallback - redirect to sign-in using current domain
      const signInUrl = new URL("/sign-in", baseUrl);
      signInUrl.searchParams.set("redirect_url", `${baseUrl}${pathname}`);
      signInUrl.searchParams.set("error", "auth_error");
      return NextResponse.redirect(signInUrl);
    }
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
