import { NewsletterEmail } from "@/components/emails/newsletter-email";
import { Resend } from "resend";
import * as React from "react";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Check if user is authenticated and admin
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { newsletterId } = await request.json();

  if (!newsletterId) {
    return Response.json(
      { error: "Missing newsletter ID in request body." },
      { status: 400 }
    );
  }

  try {
    // Get the newsletter
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    });

    if (!newsletter) {
      return Response.json({ error: "Newsletter not found." }, { status: 404 });
    }

    if (!newsletter.isDraft) {
      return Response.json(
        { error: "Newsletter has already been sent." },
        { status: 400 }
      );
    }

    // Get all newsletter subscribers
    const subscribers = await prisma.user.findMany({
      where: {
        isNewsletterSubscriber: true,
        unsubscribeToken: { not: null },
      },
      select: { email: true, unsubscribeToken: true },
    });

    if (subscribers.length === 0) {
      return Response.json({ error: "No subscribers found." }, { status: 400 });
    }

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      if (!subscriber.unsubscribeToken) return null;

      return resend.emails.send({
        from: "Vyoniq Newsletter <newsletter@vyoniq.com>",
        to: [subscriber.email],
        subject: newsletter.subject,
        react: NewsletterEmail({
          subject: newsletter.subject,
          content: newsletter.content,
          email: subscriber.email,
          unsubscribeToken: subscriber.unsubscribeToken,
          previewText: newsletter.previewText || undefined,
        }) as React.ReactElement,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    // Update newsletter status
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        isDraft: false,
        sentAt: new Date(),
      },
    });

    return Response.json({
      message: `Newsletter sent successfully! ${successful} emails sent, ${failed} failed.`,
      successful,
      failed,
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
