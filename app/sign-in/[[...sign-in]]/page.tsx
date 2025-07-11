"use client";

import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isProduction] = useState(process.env.NODE_ENV === "production");

  // In production, show form immediately after short delay
  useEffect(() => {
    if (isProduction) {
      const timer = setTimeout(() => {
        setShowForm(true);
      }, 1000); // 1 second delay to allow any quick Clerk initialization
      return () => clearTimeout(timer);
    }
  }, [isProduction]);

  // Redirect if user is already signed in (works in dev and prod)
  useEffect(() => {
    if (isSignedIn && user) {
      console.log("User is already signed in, redirecting to dashboard");
      router.replace("/dashboard");
    }
  }, [isSignedIn, user, router]);

  // Show sign-in form if:
  // 1. In production mode and showForm is true (bypasses Clerk loading issues)
  // 2. In development mode and Clerk has loaded and user is not signed in
  if (
    (isProduction && showForm) ||
    (!isProduction && isLoaded && !isSignedIn)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <SignIn
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: "#6E56CF",
              colorText: "#1D1D1F",
            },
          }}
        />
      </div>
    );
  }

  // Show loading state
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
          {isProduction && (
            <p className="mt-2 text-sm text-gray-500">
              Production mode detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
