import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  stripe,
  formatAmountForStripe,
  isStripeConfigured,
} from "@/lib/stripe";
import { z } from "zod";
import { getBaseUrl } from "@/lib/utils";

const CreateCheckoutSessionSchema = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
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
    const { budgetId } = CreateCheckoutSessionSchema.parse(body);

    // Fetch the budget with inquiry details
    const budget = (await prisma.budget.findUnique({
      where: { id: budgetId },
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
        payments: {
          where: {
            status: "SUCCEEDED",
          },
        },
      },
    })) as any;

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Check if user has access to this budget
    const hasAccess =
      user.isAdmin ||
      budget.inquiry.userId === userId ||
      budget.inquiry.email === user.email;

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if budget is approved
    if (budget.status !== "APPROVED") {
      return NextResponse.json(
        {
          error: "Budget must be approved before payment",
        },
        { status: 400 }
      );
    }

    // Check if budget is already paid
    if (budget.payments.length > 0) {
      return NextResponse.json(
        {
          error: "Budget has already been paid",
        },
        { status: 400 }
      );
    }

    // Check if budget is expired
    if (budget.validUntil && new Date() > budget.validUntil) {
      return NextResponse.json(
        {
          error: "Budget has expired",
        },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = budget.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description || undefined,
          metadata: {
            budgetId: budget.id,
            budgetItemId: item.id,
            category: item.category || "",
          },
        },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: budget.inquiry.email,
      success_url: `${getBaseUrl()}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/dashboard/budgets/${budgetId}`,
      metadata: {
        budgetId: budget.id,
        inquiryId: budget.inquiry.id,
        userId: userId,
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT"],
      },
    });

    // Create payment record in database
    await prisma.payment.create({
      data: {
        budgetId: budget.id,
        stripeSessionId: session.id,
        amount: Number(budget.totalAmount),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
