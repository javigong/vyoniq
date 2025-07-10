import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RedirectAfterAuth() {
  const headersList = await headers();
  const referer = headersList.get("referer");

  console.log("RedirectAfterAuth called, referer:", referer);

  const { userId } = await auth();

  if (!userId) {
    console.log("No userId found, redirecting to sign-in");
    redirect("/sign-in");
  }

  console.log("User authenticated, redirecting to user dashboard");
  redirect("/dashboard");

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
