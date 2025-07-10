"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RedirectClient() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    // Prevent infinite loops by limiting redirect attempts
    if (redirectAttempts >= 3) {
      console.log("Too many redirect attempts, redirecting to home");
      router.push("/");
      return;
    }

    if (isLoaded) {
      if (isSignedIn && user) {
        console.log("User authenticated on client, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        console.log("User not authenticated on client, redirecting to sign-in");
        setRedirectAttempts((prev) => prev + 1);
        // Add a small delay to prevent rapid redirects
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
      }
    }
  }, [isLoaded, isSignedIn, user, router, redirectAttempts]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vyoniq-blue mx-auto"></div>
        <p className="mt-4 text-lg">
          {!isLoaded ? "Loading..." : "Redirecting..."}
        </p>
        {redirectAttempts > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Attempt {redirectAttempts}/3
          </p>
        )}
      </div>
    </div>
  );
}
