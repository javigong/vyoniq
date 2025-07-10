import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type {
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogPostCategory,
} from "@/lib/generated/prisma";

type BlogPostWithIncludes = BlogPost & {
  author: BlogAuthor;
  categories: (BlogPostCategory & {
    category: BlogCategory;
  })[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: any = {
      published: true,
    };

    // Add category filter
    if (category && category !== "All") {
      where.categories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add featured filter
    if (featured === "true") {
      where.featured = true;
    }

    const posts = (await prisma.blogPost.findMany({
      where,
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
    })) as BlogPostWithIncludes[];

    // Transform the data to match the frontend format
    const transformedPosts = posts.map((post) => ({
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
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
