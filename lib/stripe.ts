import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe as StripeJS } from "@stripe/stripe-js";
import { getBaseUrl } from "./utils";

// Server-side Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-05-28.basil",
    })
  : null;

// Client-side Stripe instance (only initialize in browser)
let stripePromise: Promise<StripeJS | null> | null = null;

export const getStripe = () => {
  // Check if we're in the browser and have the publishable key
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be disabled."
    );
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Helper function to check if Stripe is properly configured (server-side)
export const isStripeConfigured = () => {
  const hasServerKey = !!process.env.STRIPE_SECRET_KEY;
  const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return hasServerKey && hasPublishableKey;
};

// Helper function to check if Stripe is configured for client-side use
export const isStripeConfiguredClient = () => {
  const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return hasPublishableKey;
};

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: "usd",
  payment_method_types: ["card"],
  mode: "payment" as const,
  success_url: `${getBaseUrl()}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${getBaseUrl()}/dashboard/payments/cancelled`,
};

// Helper function to format amounts for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to format amounts from Stripe (convert from cents)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
