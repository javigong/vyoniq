import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL for the application
 * Returns the configured base URL or falls back to appropriate defaults
 */
export function getBaseUrl(): string {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Fall back to production URL if in production, otherwise localhost
  return process.env.NODE_ENV === "production" 
    ? "https://vyoniq.com" 
    : "http://localhost:3000";
}
