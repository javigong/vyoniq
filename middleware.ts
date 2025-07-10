import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(
  (auth, req) => {
    // Protect the admin routes.
    if (isAdminRoute(req)) {
      auth.protect();
    }
  },
  {
    // Configure authorized parties for production
    authorizedParties: process.env.NODE_ENV === "production" 
      ? ["https://vyoniq.com"] 
      : undefined,
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
