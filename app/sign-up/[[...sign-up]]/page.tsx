"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <p className="mt-4 text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#6E56CF",
            colorText: "#1D1D1F",
          },
        }}
      />
    </div>
  );
}
