import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { RedirectClient } from "./redirect-client";

export default async function RedirectAfterAuth() {
  const headersList = await headers();
  const referer = headersList.get("referer");

  console.log("RedirectAfterAuth called, referer:", referer);

  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("No userId found on server, delegating to client component");

      // Check if we're coming from sign-in to prevent infinite loop
      if (referer && referer.includes("/sign-in")) {
        console.log("Detected potential redirect loop, redirecting to home");
        redirect("/");
      }

      // Let the client component handle the redirect with proper Clerk state
      return <RedirectClient />;
    }

    console.log("User authenticated on server, redirecting to user dashboard");
    redirect("/dashboard");
  } catch (error) {
    console.error("Error in redirect-after-auth:", error);
    // If there's an error, redirect to home to break any loops
    redirect("/");
  }

  // This should never be reached, but just in case
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vyoniq-blue mx-auto"></div>
        <p className="mt-4 text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
