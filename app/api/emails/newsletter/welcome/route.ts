import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome-email";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, unsubscribeToken } = await request.json();

  if (!email || !unsubscribeToken) {
    return Response.json(
      { error: "Missing email or unsubscribe token in request body." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Vyoniq Newsletter <newsletter@vyoniq.com>",
      to: [email],
      subject: "Welcome to the Vyoniq Newsletter!",
      react: NewsletterWelcomeEmail({
        email,
        unsubscribeToken,
      }) as React.ReactElement,
    });

    if (error) {
      console.error("Resend Error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Welcome email sent successfully!", data });
  } catch (error) {
    console.error("Catch Error:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
