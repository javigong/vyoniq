import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { createUserAccountForStandalone } from "@/lib/auto-user-creation";
import type { Budget, BudgetItem } from "@/lib/generated/prisma";

// Schema for creating a standalone budget (creates user and inquiry automatically)
const CreateStandaloneBudgetSchema = z.object({
  // Client information
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  serviceType: z.string().min(1, "Service type is required"),
  inquiryMessage: z.string().optional(),

  // Budget information
  title: z.string().min(1, "Budget title is required"),
  description: z.string().optional(),
  validUntil: z.string().optional(), // ISO date string
  adminNotes: z.string().optional(),
  currency: z
    .enum(["USD", "CAD"]) // Budget-level currency selection
    .default("USD"),
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
    .min(1, "At least one budget item is required"),
});

// POST - Create a standalone budget (creates user and inquiry automatically)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
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
      clientName,
      clientEmail,
      serviceType,
      inquiryMessage,
      title,
      description,
      validUntil,
      adminNotes,
      currency,
      items,
    } = CreateStandaloneBudgetSchema.parse(body);

    try {
      // Create user account and inquiry automatically
      const {
        userId: createdUserId,
        inquiryId,
        password,
      } = await createUserAccountForStandalone(
        clientEmail,
        clientName,
        serviceType,
        "budget",
        title,
        inquiryMessage
      );

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);

      // Create the budget with items
      const budget = await prisma.budget.create({
        data: {
          inquiryId,
          title,
          description,
          totalAmount,
          currency,
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
      const serializedBudget = {
        ...budget,
        totalAmount: Number(budget.totalAmount),
        items: budget.items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        })),
      };

      return NextResponse.json({
        success: true,
        budget: serializedBudget,
        message: password
          ? `Standalone budget created successfully! User account created and welcome email sent to ${clientEmail}`
          : `Standalone budget created successfully for existing user ${clientEmail}`,
        userCreated: !!password,
        clientEmail,
      });
    } catch (userCreationError) {
      console.error("Error in standalone budget creation:", userCreationError);
      return NextResponse.json(
        {
          error: "Failed to create user account or budget",
          details:
            userCreationError instanceof Error
              ? userCreationError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating standalone budget:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create standalone budget" },
      { status: 500 }
    );
  }
}
