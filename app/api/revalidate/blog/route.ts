import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { slug, action } = body;

    if (action === "revalidate-all") {
      // Revalidate all blog pages
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");

      return NextResponse.json({
        success: true,
        message: "All blog pages revalidated successfully",
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "revalidate-post" && slug) {
      // Revalidate specific blog post
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/blog"); // Also revalidate blog index

      return NextResponse.json({
        success: true,
        message: `Blog post '${slug}' revalidated successfully`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Invalid action or missing slug" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error revalidating blog:", error);
    return NextResponse.json(
      { error: "Failed to revalidate blog" },
      { status: 500 }
    );
  }
}
