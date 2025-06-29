import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema for creating a budget
const CreateBudgetSchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  title: z.string().min(1, "Budget title is required"),
  description: z.string().optional(),
  validUntil: z.string().optional(), // ISO date string
  adminNotes: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      description: z.string().optional(),
      quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
      unitPrice: z.number().min(0, "Unit price must be non-negative"),
      category: z.string().optional(),
      servicePricingId: z.string().optional(),
      isCustom: z.boolean().default(false),
    })
  ).min(1, "At least one budget item is required"),
});

// POST - Create a new budget (Admin only)
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
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { inquiryId, title, description, validUntil, adminNotes, items } = 
      CreateBudgetSchema.parse(body);

    // Verify the inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Create the budget with items
    const budget = await prisma.budget.create({
      data: {
        inquiryId,
        title,
        description,
        totalAmount,
        validUntil: validUntil ? new Date(validUntil) : null,
        adminNotes,
        createdById: userId,
        items: {
          create: items.map(item => ({
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

    return NextResponse.json({
      success: true,
      budget,
      message: "Budget created successfully",
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}

// GET - Fetch budgets
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

    // If user is admin, they can see all budgets
    // If user is not admin, they can only see budgets for their inquiries
    if (!user.isAdmin) {
      const userInquiryIds = await prisma.inquiry.findMany({
        where: {
          OR: [
            { userId: userId },
            { email: user.email },
          ],
        },
        select: { id: true },
      });

      where.inquiryId = {
        in: userInquiryIds.map(inquiry => inquiry.id),
      };
    }

    if (inquiryId) {
      where.inquiryId = inquiryId;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        items: true,
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
            status: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,
          },
        },
        _count: {
          select: {
            items: true,
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.budget.count({ where });

    return NextResponse.json({
      budgets,
      totalCount,
      hasMore: totalCount > offset + limit,
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}