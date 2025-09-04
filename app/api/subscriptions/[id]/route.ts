import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import React from "react";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/utils";
import type {
  Subscription,
  SubscriptionItem,
  Inquiry,
  SubscriptionPayment,
} from "@/lib/generated/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RouteParams {
  id: string;
}

// Schema for updating subscription status (can be used by client to approve/reject)
const UpdateSubscriptionStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SENT",
    "APPROVED",
    "REJECTED",
    "EXPIRED",
    "ACTIVE",
    "CANCELLED",
    "PAST_DUE",
    "COMPLETED",
  ]),
  clientNotes: z.string().optional(),
});

// Schema for updating subscription
const UpdateSubscriptionSchema = z.object({
  title: z.string().min(1, "Subscription title is required").optional(),
  description: z.string().optional(),
  validUntil: z.string().optional(), // ISO date string
  adminNotes: z.string().optional(),
  // Allow updating currency only if the subscription is still in DRAFT or SENT; we'll enforce in handler
  currency: z.enum(["USD", "CAD"]).optional(),
  billingInterval: z.enum(["month", "year"]).optional(),
  trialPeriodDays: z.number().int().min(0).max(365).optional(),
  status: z
    .enum([
      "DRAFT",
      "SENT",
      "APPROVED",
      "REJECTED",
      "EXPIRED",
      "ACTIVE",
      "CANCELLED",
      "PAST_DUE",
      "COMPLETED",
    ])
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().optional(), // For existing items
        name: z.string().min(1, "Item name is required"),
        description: z.string().optional(),
        quantity: z
          .number()
          .int()
          .min(1, "Quantity must be at least 1")
          .default(1),
        unitPrice: z.number().min(0, "Unit price must be non-negative"),
        category: z.string().optional(),
        servicePricingId: z.string().optional(),
        isCustom: z.boolean().default(true),
      })
    )
    .optional(),
});

// PUT - Update subscription (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      validUntil,
      adminNotes,
      currency,
      billingInterval,
      trialPeriodDays,
      status,
      items,
    } = UpdateSubscriptionSchema.parse(body);

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(currency && { currency }),
        ...(billingInterval && { billingInterval }),
        ...(trialPeriodDays !== undefined && { trialPeriodDays }),
        ...(status && { status }),
      },
      include: {
        items: true,
        inquiry: true,
      },
    });

    // Update items if provided
    if (items) {
      // Delete existing items and create new ones (simpler approach)
      await prisma.subscriptionItem.deleteMany({
        where: { subscriptionId: id },
      });

      // Calculate new total amount
      const totalAmount = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      // Update subscription with new total amount and create new items
      await prisma.subscription.update({
        where: { id },
        data: {
          monthlyAmount: totalAmount,
          items: {
            create: items.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity,
              category: item.category,
              servicePricingId: item.servicePricingId,
              isCustom: item.isCustom,
            })),
          },
        },
      });
    }

    // Serialize Decimal fields to numbers for client components
    const serializedSubscription = {
      ...updatedSubscription,
      monthlyAmount: Number(updatedSubscription.monthlyAmount),
      items: updatedSubscription.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json({
      success: true,
      subscription: serializedSubscription,
      message: "Subscription updated successfully",
    });
  } catch (error) {
    console.error("Error updating subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// PATCH - Update subscription status (can be used by client to approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, clientNotes } = UpdateSubscriptionStatusSchema.parse(body);

    // Check if subscription exists and user has access
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        inquiry: {
          select: {
            id: true,
            userId: true,
            email: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    const hasAccess =
      user.isAdmin ||
      subscription.inquiry.userId === userId ||
      subscription.inquiry.email === user.email;

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Non-admin users can only approve or reject subscriptions
    if (!user.isAdmin && !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          error: "Clients can only approve or reject subscriptions",
        },
        { status: 403 }
      );
    }

    // Update subscription status
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status,
        ...(clientNotes !== undefined && { clientNotes }),
      },
      include: {
        items: true,
        inquiry: true,
      },
    });

    // Send email notification if subscription is being sent to client
    if (status === "SENT" && user.isAdmin) {
      try {
        await sendSubscriptionNotificationEmail(updatedSubscription);
        console.log(
          `Subscription notification email sent to ${updatedSubscription.inquiry.email}`
        );
      } catch (emailError) {
        console.error(
          "Failed to send subscription notification email:",
          emailError
        );
        // Don't fail the request if email fails
      }
    }

    // Serialize Decimal fields to numbers for client components
    const serializedSubscription = {
      ...updatedSubscription,
      monthlyAmount: Number(updatedSubscription.monthlyAmount),
      items: updatedSubscription.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json({
      success: true,
      subscription: serializedSubscription,
      message: `Subscription ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error updating subscription status:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        subscriptions: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if subscription has active payments
    const hasActivePayments = subscription.subscriptions.some(
      (payment) => payment.status === "ACTIVE"
    );

    if (hasActivePayments) {
      return NextResponse.json(
        { error: "Cannot delete subscription with active payments" },
        { status: 400 }
      );
    }

    // Delete subscription (items will be deleted due to cascade)
    await prisma.subscription.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}

// Helper function to send subscription notification email
async function sendSubscriptionNotificationEmail(subscription: any) {
  try {
    // Prepare subscription data for email template
    const subscriptionData = {
      ...subscription,
      monthlyAmount: Number(subscription.monthlyAmount),
      items: subscription.items.map((item: any) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    await resend.emails.send({
      from: "Vyoniq <noreply@vyoniq.com>",
      to: subscription.inquiry.email,
      subject: `Subscription Proposal Ready: ${subscription.title}`,
      react: React.createElement(
        "div",
        {},
        React.createElement(
          "h1",
          {},
          `Subscription Proposal: ${subscription.title}`
        ),
        React.createElement("p", {}, `Hello ${subscription.inquiry.name},`),
        React.createElement(
          "p",
          {},
          `We've prepared a subscription proposal for your ${subscription.inquiry.serviceType} project.`
        ),
        React.createElement(
          "p",
          {},
          `Monthly Amount: ${
            subscription.currency === "CAD" ? "CA$" : "$"
          }${subscriptionData.monthlyAmount.toFixed(2)} ${
            subscription.currency
          }`
        ),
        React.createElement(
          "p",
          {},
          `Billing: ${
            subscription.billingInterval === "year" ? "Yearly" : "Monthly"
          }`
        ),
        React.createElement(
          "p",
          {},
          `Please log in to your dashboard to review and approve this subscription.`
        ),
        React.createElement(
          "a",
          {
            href: `${getBaseUrl()}/dashboard`,
            style: {
              backgroundColor: "#6E56CF",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
              marginTop: "16px",
            },
          },
          "Review Subscription"
        )
      ),
    });
  } catch (error) {
    console.error("Error sending subscription notification email:", error);
    throw error;
  }
}
