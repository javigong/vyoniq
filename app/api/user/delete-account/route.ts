import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Start a transaction to ensure all deletions happen together
    await prisma.$transaction(async (tx) => {
      // Delete user's inquiry messages first (foreign key constraint)
      await tx.inquiryMessage.deleteMany({
        where: { authorId: userId },
      });

      // Delete user's inquiries
      await tx.inquiry.deleteMany({
        where: { userId: userId },
      });

      // Delete user's blog posts if any
      await tx.blogPost.deleteMany({
        where: { authorId: userId },
      });

      // Finally delete the user record
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // Delete the user from Clerk
    await clerkClient().users.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
