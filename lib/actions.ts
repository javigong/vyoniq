"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    // Use upsert to find an existing user or create a new one.
    // This handles cases where a user might subscribe to the newsletter
    // before or after creating a full account.
    await prisma.user.upsert({
      where: { email: email },
      update: { isNewsletterSubscriber: true },
      create: {
        id: `newsletter-${Date.now()}`, // Create a temporary, unique ID
        email: email,
        isNewsletterSubscriber: true,
      },
    });

    // Revalidate the admin dashboard path so the new subscriber appears immediately.
    revalidatePath("/admin/dashboard");

    return { success: "You have been subscribed to the newsletter!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
