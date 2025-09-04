import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { z } from "zod";
import { getBaseUrl } from "@/lib/utils";

const CreateSubscriptionCheckoutSessionSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json(
        {
          error:
            "Payment processing is currently unavailable. Please contact support.",
        },
        { status: 503 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { subscriptionId } =
      CreateSubscriptionCheckoutSessionSchema.parse(body);

    // Fetch the subscription with inquiry details
    const subscription = (await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        items: true,
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
            userId: true,
          },
        },
        subscriptions: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    })) as any;

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this subscription
    const hasAccess =
      user.isAdmin ||
      subscription.inquiry.userId === userId ||
      subscription.inquiry.email === user.email;

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if subscription is approved
    if (subscription.status !== "APPROVED") {
      return NextResponse.json(
        {
          error: "Subscription must be approved before payment",
        },
        { status: 400 }
      );
    }

    // Check if subscription is already active
    if (subscription.subscriptions.length > 0) {
      return NextResponse.json(
        {
          error: "Subscription is already active",
        },
        { status: 400 }
      );
    }

    // Check if subscription is expired
    if (subscription.validUntil && new Date() > subscription.validUntil) {
      return NextResponse.json(
        {
          error: "Subscription has expired",
        },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerEmail = subscription.inquiry.email;
    const customerName = subscription.inquiry.name;

    let stripeCustomer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomer = existingCustomers.data[0];
    } else {
      stripeCustomer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: {
          subscriptionId: subscription.id,
          inquiryId: subscription.inquiry.id,
          userId: userId,
        },
      });
    }

    // Create or get Stripe product and price
    const currency = (subscription.currency || "USD").toLowerCase();
    if (!["usd", "cad"].includes(currency)) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    let stripeProduct;
    let stripePrice;

    if (subscription.stripeProductId && subscription.stripePriceId) {
      // Use existing product and price
      try {
        stripeProduct = await stripe.products.retrieve(
          subscription.stripeProductId
        );
        stripePrice = await stripe.prices.retrieve(subscription.stripePriceId);
      } catch (error) {
        // Product or price doesn't exist, create new ones
        stripeProduct = null;
        stripePrice = null;
      }
    }

    if (!stripeProduct || !stripePrice) {
      // Create new Stripe product
      stripeProduct = await stripe.products.create({
        name: subscription.title,
        description:
          subscription.description ||
          `Subscription for ${subscription.inquiry.serviceType}`,
        metadata: {
          subscriptionId: subscription.id,
          inquiryId: subscription.inquiry.id,
        },
      });

      // Create Stripe price
      const intervalCount = subscription.billingInterval === "year" ? 12 : 1;
      const interval =
        subscription.billingInterval === "year" ? "year" : "month";

      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(Number(subscription.monthlyAmount) * 100), // Convert to cents
        currency,
        recurring: {
          interval: interval as "month" | "year",
          interval_count: subscription.billingInterval === "year" ? 1 : 1,
        },
        metadata: {
          subscriptionId: subscription.id,
          billingInterval: subscription.billingInterval,
        },
      });

      // Update subscription with Stripe IDs
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      });
    }

    // Create Stripe checkout session for subscription
    const sessionParams: any = {
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      success_url: `${getBaseUrl()}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/dashboard/subscriptions/${subscriptionId}`,
      metadata: {
        subscriptionId: subscription.id,
        inquiryId: subscription.inquiry.id,
        userId: userId,
        currency,
        type: "subscription",
      },
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
      allow_promotion_codes: true,
    };

    // Add trial period if specified
    if (subscription.trialPeriodDays && subscription.trialPeriodDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: subscription.trialPeriodDays,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Create subscription payment record in database
    await prisma.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        stripeCustomerId: stripeCustomer.id,
        amount: Number(subscription.monthlyAmount),
        currency: subscription.currency || "USD",
        status: "PENDING",
        metadata: {
          checkoutSessionId: session.id,
          stripeCustomerId: stripeCustomer.id,
          stripePriceId: stripePrice.id,
          stripeProductId: stripeProduct.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating subscription checkout session:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subscription checkout session" },
      { status: 500 }
    );
  }
}
