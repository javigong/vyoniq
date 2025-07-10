import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface RouteParams {
  id: string;
}

// Schema for updating budget status
const UpdateBudgetStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SENT",
    "APPROVED",
    "REJECTED",
    "EXPIRED",
    "PAID",
    "COMPLETED",
  ]),
  clientNotes: z.string().optional(),
});

// Schema for updating budget
const UpdateBudgetSchema = z.object({
  title: z.string().min(1, "Budget title is required").optional(),
  description: z.string().optional(),
  validUntil: z.string().optional(), // ISO date string
  adminNotes: z.string().optional(),
  status: z
    .enum([
      "DRAFT",
      "SENT",
      "APPROVED",
      "REJECTED",
      "EXPIRED",
      "PAID",
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
        isCustom: z.boolean().default(false),
      })
    )
    .optional(),
});

// GET - Fetch a specific budget
export async function GET(
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

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            servicePricing: true,
          },
        },
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
            status: true,
            userId: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

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

    // Serialize Decimal fields to numbers for client components
    const serializedBudget = {
      ...budget,
      totalAmount: Number(budget.totalAmount),
      items: budget.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
      payments: budget.payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
      })),
    };

    return NextResponse.json({ budget: serializedBudget });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

// PUT - Update a budget (Admin only)
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
    const { title, description, validUntil, adminNotes, status, items } =
      UpdateBudgetSchema.parse(body);

    // Check if budget exists
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Calculate new total if items are provided
    let totalAmount = existingBudget.totalAmount;
    if (items) {
      const newTotal = items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);
      totalAmount = newTotal;
    }

    // Update budget
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(status && { status }),
        ...(items && {
          totalAmount: totalAmount,
          items: {
            deleteMany: {}, // Remove all existing items
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
        }),
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
      ...updatedBudget,
      totalAmount: Number(updatedBudget.totalAmount),
      items: updatedBudget.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json({
      success: true,
      budget: serializedBudget,
      message: "Budget updated successfully",
    });
  } catch (error) {
    console.error("Error updating budget:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// PATCH - Update budget status (can be used by client to approve/reject)
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
    const { status, clientNotes } = UpdateBudgetStatusSchema.parse(body);

    // Check if budget exists and user has access
    const budget = await prisma.budget.findUnique({
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

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Check access permissions
    const hasAccess =
      user.isAdmin ||
      budget.inquiry.userId === userId ||
      budget.inquiry.email === user.email;

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Non-admin users can only approve or reject budgets
    if (!user.isAdmin && !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          error: "Clients can only approve or reject budgets",
        },
        { status: 403 }
      );
    }

    // Update budget status
    const updatedBudget = await prisma.budget.update({
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

    // Serialize Decimal fields to numbers for client components
    const serializedBudget = {
      ...updatedBudget,
      totalAmount: Number(updatedBudget.totalAmount),
      items: updatedBudget.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    };

    return NextResponse.json({
      success: true,
      budget: serializedBudget,
      message: `Budget ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error updating budget status:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update budget status" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a budget (Admin only)
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

    // Check if budget exists
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Don't allow deletion if there are successful payments
    const hasSuccessfulPayments = budget.payments.some(
      (payment) => payment.status === "SUCCEEDED"
    );

    if (hasSuccessfulPayments) {
      return NextResponse.json(
        {
          error: "Cannot delete budget with successful payments",
        },
        { status: 400 }
      );
    }

    // Delete the budget (items will be deleted due to cascade)
    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
