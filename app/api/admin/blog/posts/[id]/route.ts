import { NextRequest, NextResponse } from "next/server";
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

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const transformedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toISOString(),
      readTime: post.readTime,
      featured: post.featured,
      published: post.published,
      tintColor: post.tintColor,
      author: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar || "",
        title: post.author.title,
      },
      categories: post.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      publishDate,
      readTime,
      featured,
      published,
      tintColor,
      authorId,
      categoryIds = [],
    } = body;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Check if new slug already exists (excluding current post)
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this title already exists" },
          { status: 400 }
        );
      }
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(coverImage && { coverImage }),
        ...(publishDate && { publishDate: new Date(publishDate) }),
        ...(readTime !== undefined && { readTime }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(tintColor !== undefined && { tintColor }),
        ...(authorId && { authorId }),
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Update category relationships if provided
    if (categoryIds.length >= 0) {
      // Remove existing categories
      await prisma.blogPostCategory.deleteMany({
        where: { blogPostId: id },
      });

      // Add new categories
      if (categoryIds.length > 0) {
        await prisma.blogPostCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            blogPostId: id,
            categoryId,
          })),
        });
      }
    }

    // Fetch the complete updated post with categories
    const completePost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const transformedPost = {
      id: completePost!.id,
      slug: completePost!.slug,
      title: completePost!.title,
      excerpt: completePost!.excerpt,
      content: completePost!.content,
      coverImage: completePost!.coverImage,
      publishDate: completePost!.publishDate.toISOString(),
      readTime: completePost!.readTime,
      featured: completePost!.featured,
      published: completePost!.published,
      tintColor: completePost!.tintColor,
      author: {
        id: completePost!.author.id,
        name: completePost!.author.name,
        avatar: completePost!.author.avatar || "",
        title: completePost!.author.title,
      },
      categories: completePost!.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
      createdAt: completePost!.createdAt.toISOString(),
      updatedAt: completePost!.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the blog post (categories will be deleted automatically due to cascade)
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
