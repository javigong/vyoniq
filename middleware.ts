import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that should be accessible without authentication
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

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
