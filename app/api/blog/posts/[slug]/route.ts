import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
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

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend format
    const transformedPost = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: post.readTime,
      author: {
        name: post.author.name,
        avatar: post.author.avatar || "",
        title: post.author.title,
      },
      categories: post.categories.map((pc) => pc.category.name),
      featured: post.featured,
      tintColor: post.tintColor,
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
