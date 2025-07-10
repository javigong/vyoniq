import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { getBaseUrl } from "@/lib/utils";

function SignUpContent() {
  const baseUrl = getBaseUrl();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp
          forceRedirectUrl={`${baseUrl}/dashboard`}
          signInForceRedirectUrl={`${baseUrl}/dashboard`}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#6E56CF] hover:bg-[#5A45B5]",
              footerActionLink: "text-[#6E56CF] hover:text-[#5A45B5]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
