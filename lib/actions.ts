"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    // Check if user already exists and is subscribed
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser && existingUser.isNewsletterSubscriber) {
      return { error: "You are already subscribed to our newsletter!" };
    }

    // Generate unsubscribe token
    const unsubscribeToken = generateUnsubscribeToken();

    // Use upsert to find an existing user or create a new one.
    // This handles cases where a user might subscribe to the newsletter
    // before or after creating a full account.
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        isNewsletterSubscriber: true,
        unsubscribeToken: unsubscribeToken,
      },
      create: {
        id: `newsletter-${Date.now()}`, // Create a temporary, unique ID
        email: email,
        isNewsletterSubscriber: true,
        unsubscribeToken: unsubscribeToken,
      },
    });

    // Send welcome email
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/emails/newsletter/welcome`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            unsubscribeToken: user.unsubscribeToken,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to send welcome email:", await response.text());
        // Don't fail the subscription if email fails
      }
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    // Revalidate the admin dashboard path so the new subscriber appears immediately.
    revalidatePath("/admin/dashboard");

    return {
      success:
        "You have been subscribed to the newsletter! Check your email for a welcome message.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function createNewsletter(prevState: any, formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const previewText = formData.get("previewText") as string;

  if (!subject || !content) {
    return { error: "Subject and content are required." };
  }

  try {
    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        previewText: previewText || null,
      },
    });

    revalidatePath("/admin/dashboard");

    return {
      success: "Newsletter draft created successfully!",
      newsletterId: newsletter.id,
    };
  } catch (error) {
    console.error("Newsletter creation error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function updateNewsletter(
  newsletterId: string,
  prevState: any,
  formData: FormData
) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const previewText = formData.get("previewText") as string;

  if (!subject || !content) {
    return { error: "Subject and content are required." };
  }

  try {
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        subject,
        content,
        previewText: previewText || null,
      },
    });

    revalidatePath("/admin/dashboard");

    return { success: "Newsletter updated successfully!" };
  } catch (error) {
    console.error("Newsletter update error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
