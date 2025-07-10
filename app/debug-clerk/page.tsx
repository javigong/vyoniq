import { auth } from "@clerk/nextjs/server";

export default async function DebugClerkPage() {
  const { userId } = await auth();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Clerk Debug Information</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Environment</h2>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
          <p>Base URL: {process.env.NEXT_PUBLIC_BASE_URL || "Not set"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Clerk Configuration</h2>
          <p>
            Publishable Key:{" "}
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Set" : "Not set"}
          </p>
          <p>Secret Key: {process.env.CLERK_SECRET_KEY ? "Set" : "Not set"}</p>
          <p>User ID: {userId || "Not authenticated"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Request Headers</h2>
          <p>This page can help identify domain and authentication issues.</p>
        </div>
      </div>
    </div>
  );
}
