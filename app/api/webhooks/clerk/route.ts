import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { WaitlistWelcomeEmail } from "@/components/emails/waitlist-welcome-email";
import { Resend } from "resend";
import * as React from "react";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the event
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  if (eventType === "user.created") {
    const { email_addresses, first_name, last_name } = evt.data;

    const primaryEmail = email_addresses[0]?.email_address;
    const name =
      [first_name, last_name].filter(Boolean).join(" ") || "New User";

    if (!primaryEmail) {
      return new Response("Error: No primary email address found for user.", {
        status: 400,
      });
    }

    // Create user in your database
    try {
      await prisma.user.create({
        data: {
          id: evt.data.id,
          email: primaryEmail,
          name: name,
          isOnWaitlist: true,
        },
      });
    } catch (dbError) {
      console.error("Error creating user in database:", dbError);
      return new Response("Error occurred while creating user in database.", {
        status: 500,
      });
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: "Vyoniq Waitlist <waitlist@vyoniq.com>",
        to: [primaryEmail],
        subject: "Welcome to the Vyoniq Apps Waitlist!",
        react: WaitlistWelcomeEmail({ name }) as React.ReactElement,
      });

      console.log(`Sent welcome email to ${primaryEmail}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response("Error occurred while sending email.", {
        status: 500,
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
