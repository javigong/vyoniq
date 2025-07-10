import { auth } from "@clerk/nextjs/server";
import { getBaseUrl } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function DebugAuth() {
  const { userId } = await auth();

  let user = null;
  if (userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, isAdmin: true, isOnWaitlist: true },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <div className="space-y-2">
            <p>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV || "undefined"}
            </p>
            <p>
              <strong>NEXT_PUBLIC_BASE_URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_BASE_URL || "undefined"}
            </p>
            <p>
              <strong>getBaseUrl():</strong> {getBaseUrl()}
            </p>
            <p className="text-red-600">
              <strong>⚠️ Issue:</strong> If getBaseUrl() shows localhost in
              production, set NEXT_PUBLIC_BASE_URL=https://vyoniq.com in your
              production environment
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Clerk Environment Variables
          </h2>
          <div className="space-y-2">
            <p>
              <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong>{" "}
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                ? `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(
                    0,
                    20
                  )}...`
                : "undefined"}
            </p>
            <p>
              <strong>CLERK_SECRET_KEY:</strong>{" "}
              {process.env.CLERK_SECRET_KEY ? "Set (hidden)" : "undefined"}
            </p>
            <p>
              <strong>Environment:</strong>{" "}
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("_test_")
                ? "Development/Test"
                : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes(
                    "_live_"
                  )
                ? "Production/Live"
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Clerk Auth Status</h2>
          <div className="space-y-2">
            <p>
              <strong>User ID:</strong> {userId || "Not authenticated"}
            </p>
            <p>
              <strong>Has User Record:</strong> {user ? "Yes" : "No"}
            </p>
            {user && (
              <>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Is Admin:</strong> {user.isAdmin ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Is On Waitlist:</strong>{" "}
                  {user.isOnWaitlist ? "Yes" : "No"}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Expected vs Actual Redirect URLs
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Expected Production URLs:</strong>
            </p>
            <ul className="list-disc ml-6 text-green-600">
              <li>Sign-in redirect: https://vyoniq.com/dashboard</li>
              <li>Sign-up redirect: https://vyoniq.com/dashboard</li>
              <li>Base URL: https://vyoniq.com</li>
            </ul>
            <p className="mt-4">
              <strong>Current getBaseUrl():</strong>
              <span
                className={
                  getBaseUrl().includes("localhost")
                    ? "text-red-600 font-bold"
                    : "text-green-600"
                }
              >
                {getBaseUrl()}
              </span>
            </p>
            {getBaseUrl().includes("localhost") && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
                <p className="text-red-800 font-semibold">🚨 PROBLEM FOUND!</p>
                <p className="text-red-700">
                  Your production environment is using localhost URLs. Set
                  NEXT_PUBLIC_BASE_URL=https://vyoniq.com in your production
                  environment.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Fix Instructions</h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              1. Set Production Environment Variable:
            </h3>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              NEXT_PUBLIC_BASE_URL=https://vyoniq.com
            </div>

            <h3 className="font-semibold text-lg mt-4">
              2. Clerk Dashboard Configuration:
            </h3>
            <ul className="list-disc ml-6">
              <li>Go to Clerk Dashboard → Configure → Restrictions</li>
              <li>Add to "Allowed redirect origins": https://vyoniq.com</li>
              <li>Remove any localhost entries from production</li>
            </ul>

            <h3 className="font-semibold text-lg mt-4">
              3. Verify Domain Settings:
            </h3>
            <ul className="list-disc ml-6">
              <li>Authorized domains: vyoniq.com</li>
              <li>After sign-in URL: /dashboard</li>
              <li>After sign-up URL: /dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
