import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { BlogCategory } from "@/lib/generated/prisma";

type BlogCategoryWithCount = BlogCategory & {
  _count: {
    blogPosts: number;
  };
};

// Helper function to check admin access
async function checkAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isAdmin) {
    return { error: "Forbidden", status: 403 };
  }

  return { user };
}

// GET - List all categories
export async function GET() {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const categories = (await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: {
            blogPosts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })) as BlogCategoryWithCount[];

    const transformedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      postCount: category._count.blogPosts,
      createdAt: category.createdAt.toISOString(),
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.blogCategory.create({
      data: {
        name,
        slug,
      },
      include: {
        _count: {
          select: {
            blogPosts: true,
          },
        },
      },
    }) as BlogCategoryWithCount;

    const transformedCategory = {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      postCount: newCategory._count.blogPosts,
      createdAt: newCategory.createdAt.toISOString(),
    };

    return NextResponse.json(transformedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
