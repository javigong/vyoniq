import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL for the application
 * Works in both server and client contexts
 * Returns the configured base URL or falls back to appropriate defaults
 */
export function getBaseUrl(): string {
  // Client-side: Use window.location if available
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Check for production environment indicators
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  // Fall back to production URL if in production, otherwise localhost
  return isProduction ? "https://vyoniq.com" : "http://localhost:3000";
}
