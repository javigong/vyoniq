import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event;

  try {
    const body = await request.text();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;
      // Subscription webhook handlers
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log("Processing checkout session completed:", session.id);

    const budgetId = session.metadata?.budgetId;
    const subscriptionId = session.metadata?.subscriptionId;
    const inquiryId = session.metadata?.inquiryId;
    const sessionType = session.metadata?.type;

    // Handle subscription checkout session
    if (sessionType === "subscription" && subscriptionId) {
      await handleSubscriptionCheckoutCompleted(
        session,
        subscriptionId,
        inquiryId
      );
      return;
    }

    // Handle budget checkout session (existing logic)
    if (!budgetId) {
      console.error("No budgetId found in session metadata");
      return;
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: {
        stripeSessionId: session.id,
      },
      data: {
        status: "SUCCEEDED",
        stripePaymentId: session.payment_intent,
        paidAt: new Date(),
        paymentMethod: session.payment_method_types?.[0] || "card",
        // Keep currency aligned with the checkout session
        currency: (
          session.currency ||
          session.metadata?.currency ||
          "usd"
        ).toUpperCase(),
        metadata: session,
      },
    });

    // Update budget status to PAID
    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: { status: "PAID" },
      include: {
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
          },
        },
        items: true,
      },
    });

    // Update inquiry status to PAID since payment is completed
    if (inquiryId) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: "PAID" },
      });
    }

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(budget, payment, session);

    console.log(`Successfully processed payment for budget ${budgetId}`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log("Processing payment intent succeeded:", paymentIntent.id);

    // Update payment record if it exists
    await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: "SUCCEEDED",
        paidAt: new Date(),
        metadata: paymentIntent,
      },
    });
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log("Processing payment intent failed:", paymentIntent.id);

    // Update payment record
    await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        failureReason:
          paymentIntent.last_payment_error?.message || "Payment failed",
        metadata: paymentIntent,
      },
    });
  } catch (error) {
    console.error("Error handling payment intent failed:", error);
    throw error;
  }
}

async function sendPaymentConfirmationEmail(
  budget: any,
  payment: any,
  session: any
) {
  try {
    const totalAmount = Number(budget.totalAmount);
    const itemsList = budget.items
      .map(
        (item: any) =>
          `<li>${item.name} (${item.quantity}x) - $${Number(
            item.totalPrice
          ).toFixed(2)}</li>`
      )
      .join("");

    await resend.emails.send({
      from: "Vyoniq <noreply@vyoniq.com>",
      to: budget.inquiry.email,
      subject: "Payment Confirmed - Your Vyoniq Project is Starting!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your project is ready to begin</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${
              budget.inquiry.name
            },</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
              Great news! We've confirmed your payment and your Vyoniq project is officially underway. 
              Our team will begin work immediately and keep you updated on progress.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
              <h3 style="color: #10B981; margin: 0 0 15px 0;">Payment Details</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Budget Title:</strong> ${
                budget.title
              }</p>
              <p style="margin: 5px 0; color: #666;"><strong>Total Amount:</strong> $${totalAmount.toFixed(
                2
              )}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Payment ID:</strong> ${
                payment.id
              }</p>
              <p style="margin: 5px 0; color: #666;"><strong>Service Type:</strong> ${
                budget.inquiry.serviceType
              }</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3B82F6; margin: 0 0 15px 0;">Project Items</h3>
              <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
                ${itemsList}
              </ul>
            </div>
            
            <h3 style="color: #3B82F6; margin: 30px 0 15px 0;">What Happens Next?</h3>
            <ol style="color: #333; line-height: 1.6; margin-bottom: 25px;">
              <li>Our project manager will contact you within 24 hours</li>
              <li>We'll set up regular check-ins and progress updates</li>
              <li>Development will begin according to the agreed timeline</li>
              <li>You'll receive regular updates through your dashboard</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
                              <a href="${getBaseUrl()}/dashboard/inquiries/${
        budget.inquiry.id
      }" 
                 style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Project Status
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
              Have questions? Reply to this email or contact us at 
              <a href="mailto:support@vyoniq.com" style="color: #3B82F6;">support@vyoniq.com</a>
            </p>
            
            <p style="font-size: 16px; color: #333; margin-top: 30px;">
              Thank you for choosing Vyoniq!<br>
              <strong>The Vyoniq Team</strong>
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              This email was sent from Vyoniq regarding your payment confirmation.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Payment confirmation email sent to ${budget.inquiry.email}`);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    // Don't throw - email failure shouldn't fail the webhook
  }
}

// Subscription webhook handlers
async function handleSubscriptionCheckoutCompleted(
  session: any,
  subscriptionId: string,
  inquiryId?: string
) {
  try {
    console.log(
      "Processing subscription checkout session completed:",
      session.id
    );

    // Update subscription payment record
    await prisma.subscriptionPayment.updateMany({
      where: {
        subscriptionId: subscriptionId,
        metadata: {
          path: ["checkoutSessionId"],
          equals: session.id,
        },
      },
      data: {
        status: "PENDING", // Will be updated when actual subscription is created
        stripeCustomerId: session.customer,
        metadata: {
          ...session,
          stripeSessionId: session.id, // Store session ID for easy lookup
        },
      },
    });

    // Update inquiry status to PAID since checkout is completed
    if (inquiryId) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: "PAID" },
      });
    }

    console.log(
      `Successfully processed subscription checkout for subscription ${subscriptionId}`
    );
  } catch (error) {
    console.error("Error handling subscription checkout completed:", error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log("Processing subscription created:", subscription.id);

    // Find the subscription payment record by customer ID
    // Try multiple approaches to find the right record
    let subscriptionPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        stripeCustomerId: subscription.customer,
        status: "PENDING", // Look for pending payments
      },
      include: {
        subscription: {
          include: {
            inquiry: true,
          },
        },
      },
    });

    // If not found by pending status, try by customer ID only
    if (!subscriptionPayment) {
      subscriptionPayment = await prisma.subscriptionPayment.findFirst({
        where: {
          stripeCustomerId: subscription.customer,
        },
        include: {
          subscription: {
            include: {
              inquiry: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Get the most recent one
        },
      });
    }

    if (!subscriptionPayment) {
      console.error(
        "No subscription payment record found for subscription:",
        subscription.id,
        "customer:",
        subscription.customer
      );

      // Log all subscription payments for this customer for debugging
      const allPayments = await prisma.subscriptionPayment.findMany({
        where: {
          stripeCustomerId: subscription.customer,
        },
        select: {
          id: true,
          status: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          createdAt: true,
        },
      });
      console.log("All payments for this customer:", allPayments);
      return;
    }

    // Update subscription payment with Stripe subscription details
    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: {
        stripeSubscriptionId: subscription.id,
        status: "ACTIVE",
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        metadata: subscription,
      },
    });

    // CRITICAL: Also update the main Subscription status to ACTIVE
    await prisma.subscription.update({
      where: { id: subscriptionPayment.subscriptionId },
      data: {
        status: "ACTIVE",
        stripeProductId: subscription.items.data[0]?.price?.product,
        stripePriceId: subscription.items.data[0]?.price?.id,
      },
    });

    // Update inquiry status to PAID since subscription is active
    if (subscriptionPayment.subscription.inquiry) {
      await prisma.inquiry.update({
        where: { id: subscriptionPayment.subscription.inquiry.id },
        data: { status: "PAID" },
      });
    }

    console.log(
      `Successfully activated subscription ${subscriptionPayment.subscriptionId}`
    );
  } catch (error) {
    console.error("Error handling subscription created:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log("Processing subscription updated:", subscription.id);

    // Find the subscription payment record
    const subscriptionPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (!subscriptionPayment) {
      console.error(
        "No subscription payment record found for subscription:",
        subscription.id
      );
      return;
    }

    // Map Stripe status to our status
    let status = "ACTIVE";
    switch (subscription.status) {
      case "active":
        status = "ACTIVE";
        break;
      case "past_due":
        status = "PAST_DUE";
        break;
      case "canceled":
        status = "CANCELLED";
        break;
      case "unpaid":
        status = "UNPAID";
        break;
      case "incomplete":
        status = "INCOMPLETE";
        break;
      case "incomplete_expired":
        status = "INCOMPLETE_EXPIRED";
        break;
      case "trialing":
        status = "TRIALING";
        break;
      case "paused":
        status = "PAUSED";
        break;
      default:
        status = "PENDING";
    }

    // Update subscription payment record
    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: {
        status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        nextBillingDate:
          subscription.status === "active"
            ? new Date(subscription.current_period_end * 1000)
            : null,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        endedAt: subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : null,
        metadata: subscription,
      },
    });

    // Update subscription status based on Stripe subscription status
    const subscriptionStatus =
      subscription.status === "active"
        ? "ACTIVE"
        : subscription.status === "canceled"
        ? "CANCELLED"
        : subscription.status === "past_due"
        ? "PAST_DUE"
        : "ACTIVE";

    await prisma.subscription.update({
      where: { id: subscriptionPayment.subscriptionId },
      data: { status: subscriptionStatus },
    });

    console.log(
      `Successfully updated subscription ${subscriptionPayment.subscriptionId} with status ${status}`
    );
  } catch (error) {
    console.error("Error handling subscription updated:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Processing subscription deleted:", subscription.id);

    // Find the subscription payment record
    const subscriptionPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (!subscriptionPayment) {
      console.error(
        "No subscription payment record found for subscription:",
        subscription.id
      );
      return;
    }

    // Update subscription payment record
    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: {
        status: "CANCELLED",
        canceledAt: new Date(),
        endedAt: new Date(),
        metadata: subscription,
      },
    });

    // Update subscription status to CANCELLED
    await prisma.subscription.update({
      where: { id: subscriptionPayment.subscriptionId },
      data: { status: "CANCELLED" },
    });

    console.log(
      `Successfully cancelled subscription ${subscriptionPayment.subscriptionId}`
    );
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log("Processing invoice payment succeeded:", invoice.id);

    if (!invoice.subscription) {
      console.log("Invoice is not for a subscription, skipping");
      return;
    }

    // Find the subscription payment record
    const subscriptionPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        stripeSubscriptionId: invoice.subscription,
      },
      include: {
        subscription: {
          include: {
            inquiry: true,
          },
        },
      },
    });

    if (!subscriptionPayment) {
      console.error(
        "No subscription payment record found for subscription:",
        invoice.subscription
      );
      return;
    }

    // Update the payment record with successful payment details
    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
        nextBillingDate: new Date(invoice.period_end * 1000),
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        metadata: {
          ...subscriptionPayment.metadata,
          lastInvoice: invoice,
        },
      },
    });

    // Also ensure the main subscription status is ACTIVE
    await prisma.subscription.update({
      where: { id: subscriptionPayment.subscriptionId },
      data: { status: "ACTIVE" },
    });

    // Update inquiry status to PAID since payment succeeded
    if (subscriptionPayment.subscription.inquiry) {
      await prisma.inquiry.update({
        where: { id: subscriptionPayment.subscription.inquiry.id },
        data: { status: "PAID" },
      });
    }

    console.log(
      `Successfully processed invoice payment for subscription ${subscriptionPayment.subscriptionId}`
    );
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log("Processing invoice payment failed:", invoice.id);

    if (!invoice.subscription) {
      console.log("Invoice is not for a subscription, skipping");
      return;
    }

    // Find the subscription payment record
    const subscriptionPayment = await prisma.subscriptionPayment.findFirst({
      where: {
        stripeSubscriptionId: invoice.subscription,
      },
    });

    if (!subscriptionPayment) {
      console.error(
        "No subscription payment record found for subscription:",
        invoice.subscription
      );
      return;
    }

    // Update the payment record with failed payment details
    await prisma.subscriptionPayment.update({
      where: { id: subscriptionPayment.id },
      data: {
        status: "PAST_DUE",
        failureReason:
          invoice.last_finalization_error?.message || "Payment failed",
        metadata: {
          ...subscriptionPayment.metadata,
          failedInvoice: invoice,
        },
      },
    });

    // Update subscription status to PAST_DUE
    await prisma.subscription.update({
      where: { id: subscriptionPayment.subscriptionId },
      data: { status: "PAST_DUE" },
    });

    console.log(
      `Successfully processed failed invoice payment for subscription ${subscriptionPayment.subscriptionId}`
    );
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
    throw error;
  }
}
