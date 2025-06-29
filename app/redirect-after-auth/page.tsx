import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RedirectAfterAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    if (user?.isAdmin) {
      redirect("/admin/dashboard");
    } else {
      redirect("/dashboard");
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    // Default to user dashboard if there's an error
    redirect("/dashboard");
  }
}
