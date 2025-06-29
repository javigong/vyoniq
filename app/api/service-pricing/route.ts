import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema for creating service pricing
const CreateServicePricingSchema = z.object({
  serviceType: z.enum(["web-mobile", "hosting", "ai", "vyoniq-apps"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Base price must be non-negative"),
  currency: z.string().default("USD"),
  billingType: z.enum(["one-time", "monthly", "yearly"]).default("one-time"),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  customizable: z.boolean().default(true),
});

// POST - Create a new service pricing template (Admin only)
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
    const { serviceType, name, description, basePrice, currency, billingType, features, isActive, customizable } = 
      CreateServicePricingSchema.parse(body);

    const servicePricing = await prisma.servicePricing.create({
      data: {
        serviceType,
        name,
        description,
        basePrice,
        currency,
        billingType,
        features,
        isActive,
        customizable,
      },
    });

    return NextResponse.json({
      success: true,
      servicePricing,
      message: "Service pricing created successfully",
    });
  } catch (error) {
    console.error("Error creating service pricing:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create service pricing" },
      { status: 500 }
    );
  }
}

// GET - Fetch service pricing templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("serviceType");
    const isActive = searchParams.get("isActive");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const servicePricing = await prisma.servicePricing.findMany({
      where,
      orderBy: [
        { serviceType: "asc" },
        { basePrice: "asc" },
      ],
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.servicePricing.count({ where });

    return NextResponse.json({
      servicePricing,
      totalCount,
      hasMore: totalCount > offset + limit,
    });
  } catch (error) {
    console.error("Error fetching service pricing:", error);
    return NextResponse.json(
      { error: "Failed to fetch service pricing" },
      { status: 500 }
    );
  }
}