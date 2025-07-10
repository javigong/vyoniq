import { getBaseUrl } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function DebugAuth() {
  const { userId } = await auth();
  let user = null;

  if (userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Database error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug</h1>

        {/* Runtime URL Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚨 Runtime URL Check</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded">
              <p className="font-semibold text-blue-800">
                Current Runtime URLs:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <div>
                  getBaseUrl():{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {getBaseUrl()}
                  </span>
                </div>
                <div>
                  getClerkBaseUrl():{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {getBaseUrl()}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <p className="font-semibold text-yellow-800">
                Expected Production URLs:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <div>
                  Should be:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    https://vyoniq.com
                  </span>
                </div>
                <div>
                  Redirect should be:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    https://vyoniq.com/dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Detection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            📋 Environment Detection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p>
                <strong>NODE_ENV:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.NODE_ENV}
                </span>
              </p>
              <p>
                <strong>VERCEL_ENV:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.VERCEL_ENV || "undefined"}
                </span>
              </p>
              <p>
                <strong>NEXT_PUBLIC_VERCEL_ENV:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_VERCEL_ENV || "undefined"}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Production Detected:</strong>{" "}
                <span
                  className={`font-mono px-2 py-1 rounded ${
                    process.env.NODE_ENV === "production" ||
                    process.env.VERCEL_ENV === "production" ||
                    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {process.env.NODE_ENV === "production" ||
                  process.env.VERCEL_ENV === "production" ||
                  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
                    ? "YES"
                    : "NO"}
                </span>
              </p>
              <p>
                <strong>NEXT_PUBLIC_BASE_URL:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_BASE_URL || "Not set"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            👤 Authentication Status
          </h2>
          <div className="space-y-2">
            <p>
              <strong>User ID:</strong>{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {userId || "Not authenticated"}
              </span>
            </p>
            <p>
              <strong>Database User:</strong>{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {user ? `${user.name || user.email}` : "Not found"}
              </span>
            </p>
          </div>
        </div>

        {/* Clerk Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔑 Clerk Configuration</h2>
          <div className="space-y-2">
            <p>
              <strong>Publishable Key:</strong>{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 20) +
                  "..." || "Not set"}
              </span>
            </p>
            <p>
              <strong>Secret Key:</strong>{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {process.env.CLERK_SECRET_KEY
                  ? "***" + process.env.CLERK_SECRET_KEY.slice(-10)
                  : "Not set"}
              </span>
            </p>
            <p>
              <strong>Key Environment:</strong>{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes(
                  "_test_"
                )
                  ? "TEST"
                  : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes(
                      "_live_"
                    )
                  ? "LIVE"
                  : "UNKNOWN"}
              </span>
            </p>
          </div>
        </div>

        {/* Possible Issues & Solutions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            🚨 Possible Issues & Solutions
          </h2>
          <div className="space-y-4">
            {/* Browser/Session Cache Issue */}
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800 mb-2">
                1. Browser/Session Cache Issue
              </h3>
              <p className="text-red-700 mb-2">
                Clerk might be caching old redirect URLs in browser storage.
              </p>
              <div className="bg-red-100 p-3 rounded text-sm">
                <p className="font-semibold">Fix:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Clear all browser data for your site</li>
                  <li>Try incognito/private browsing mode</li>
                  <li>Clear localStorage and sessionStorage</li>
                </ul>
              </div>
            </div>

            {/* Clerk Dashboard Configuration */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">
                2. Clerk Dashboard Configuration
              </h3>
              <p className="text-yellow-700 mb-2">
                Check your Clerk Dashboard settings:
              </p>
              <div className="bg-yellow-100 p-3 rounded text-sm">
                <p className="font-semibold">
                  Go to Clerk Dashboard → Configure → Restrictions:
                </p>
                <ul className="list-disc ml-4 mt-1">
                  <li>
                    Allowed redirect origins: <code>https://vyoniq.com</code>
                  </li>
                  <li>Remove any localhost entries from production</li>
                  <li>Check "Paths" section for any localhost URLs</li>
                </ul>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">
                3. Environment Variables
              </h3>
              <p className="text-blue-700 mb-2">
                Ensure production environment has:
              </p>
              <div className="bg-blue-100 p-3 rounded text-sm font-mono">
                <div>NODE_ENV=production</div>
                <div>NEXT_PUBLIC_BASE_URL=https://vyoniq.com</div>
                <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...</div>
                <div>CLERK_SECRET_KEY=sk_live_...</div>
              </div>
            </div>

            {/* Check for localhost in production */}
            {getBaseUrl().includes("localhost") && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">
                  4. 🚨 CRITICAL: Localhost in Production
                </h3>
                <p className="text-red-700 mb-2">
                  Your production environment is returning localhost URLs! This
                  is why authentication redirects are failing.
                </p>
                <div className="bg-red-100 p-3 rounded text-sm">
                  <p className="font-semibold">Immediate Fix:</p>
                  <ul className="list-disc ml-4 mt-1">
                    <li>
                      Set <code>NEXT_PUBLIC_BASE_URL=https://vyoniq.com</code>{" "}
                      in your production environment
                    </li>
                    <li>
                      Ensure <code>NODE_ENV=production</code> is properly set
                    </li>
                    <li>Restart your production server</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client-Side Debug */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            🔍 Client-Side Debug Test
          </h2>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm mb-2">Open browser console and run:</p>
            <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm">
              {`console.log('window.location.origin:', window.location.origin);
console.log('localStorage:', localStorage);
console.log('sessionStorage:', sessionStorage);`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
