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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Clerk Auth</h2>
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Redirects</h2>
          <div className="space-y-2">
            {userId ? (
              user?.isAdmin ? (
                <p className="text-green-600">
                  Should redirect to: <strong>/admin/dashboard</strong>
                </p>
              ) : (
                <p className="text-blue-600">
                  Should redirect to: <strong>/dashboard</strong>
                </p>
              )
            ) : (
              <p className="text-red-600">
                Should redirect to: <strong>/sign-in</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
