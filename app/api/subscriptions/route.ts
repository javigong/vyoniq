import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type {
  Subscription,
  SubscriptionItem,
  Inquiry,
  SubscriptionPayment,
} from "@/lib/generated/prisma";

type SubscriptionWithIncludes = Subscription & {
  items: SubscriptionItem[];
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  subscriptions: {
    id: string;
    amount: any; // Decimal type
    status: string;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    nextBillingDate?: Date | null;
  }[];
  _count: {
    items: number;
    subscriptions: number;
  };
};

// Schema for creating a subscription
const CreateSubscriptionSchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  title: z.string().min(1, "Subscription title is required"),
  description: z.string().optional(),
  validUntil: z.string().optional(), // ISO date string
  adminNotes: z.string().optional(),
  currency: z
    .enum(["USD", "CAD"]) // Subscription-level currency selection
    .default("USD"),
  billingInterval: z.enum(["month", "year"]).default("month"),
  trialPeriodDays: z.number().int().min(0).max(365).optional().default(0),
  items: z
    .array(
      z.object({
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
    .min(1, "At least one item is required"),
});

// POST - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      inquiryId,
      title,
      description,
      validUntil,
      adminNotes,
      currency,
      billingInterval,
      trialPeriodDays,
      items,
    } = CreateSubscriptionSchema.parse(body);

    // Validate inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // Create subscription with items
    const subscription = await prisma.subscription.create({
      data: {
        inquiryId,
        title,
        description,
        monthlyAmount: totalAmount,
        currency,
        billingInterval,
        trialPeriodDays,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        adminNotes,
        createdById: userId,
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
      include: {
        items: true,
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
          },
        },
      },
    });

    // Serialize Decimal fields to numbers for client components
    const serializedSubscription = {
      ...subscription,
      monthlyAmount: Number(subscription.monthlyAmount),
      items: subscription.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json({
      success: true,
      subscription: serializedSubscription,
      message: "Subscription created successfully",
    });
  } catch (error) {
    console.error("Error creating subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// GET - Fetch subscriptions
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get("inquiryId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};

    // If user is admin, they can see all subscriptions
    // If user is not admin, they can only see subscriptions for their inquiries
    if (!user.isAdmin) {
      const userInquiryIds = await prisma.inquiry.findMany({
        where: {
          OR: [{ userId: userId }, { email: user.email }],
        },
        select: { id: true },
      });

      where.inquiryId = {
        in: userInquiryIds.map((inquiry) => inquiry.id),
      };
    }

    if (inquiryId) {
      where.inquiryId = inquiryId;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const subscriptions = (await prisma.subscription.findMany({
      where,
      include: {
        items: true,
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            amount: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            nextBillingDate: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            items: true,
            subscriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })) as SubscriptionWithIncludes[];

    // Serialize Decimal fields to numbers for client components
    const serializedSubscriptions = subscriptions.map((subscription) => ({
      ...subscription,
      monthlyAmount: Number(subscription.monthlyAmount),
      items: subscription.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
      subscriptions: subscription.subscriptions.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
      })),
    }));

    return NextResponse.json({
      success: true,
      subscriptions: serializedSubscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
