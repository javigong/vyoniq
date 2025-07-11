import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

// GET - List all blog posts (including drafts)
export async function GET() {
  try {
    const authResult = await checkAdminAccess();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const posts = (await prisma.blogPost.findMany({
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as BlogPostWithIncludes[];

    const transformedPosts = posts.map((post) => ({
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
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching admin blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
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
    const {
      title,
      excerpt,
      content,
      coverImage = "/llms.jpeg", // Default image
      publishDate,
      readTime,
      featured = false,
      published = false,
      tintColor,
      authorId,
      categoryIds = [],
    } = body;

    // Validate required fields
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    // Get default author if not provided
    let finalAuthorId = authorId;
    if (!finalAuthorId) {
      const defaultAuthor = await prisma.blogAuthor.findFirst({
        where: { name: "Javier Gongora" },
      });
      finalAuthorId = defaultAuthor?.id;
    }

    if (!finalAuthorId) {
      return NextResponse.json({ error: "Author not found" }, { status: 400 });
    }

    // Create the blog post
    const newPost = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        readTime: readTime || 5,
        featured,
        published,
        tintColor,
        authorId: finalAuthorId,
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

    // Add category relationships
    if (categoryIds.length > 0) {
      await prisma.blogPostCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          blogPostId: newPost.id,
          categoryId,
        })),
      });
    }

    // Fetch the complete post with categories
    const completePost = await prisma.blogPost.findUnique({
      where: { id: newPost.id },
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

    return NextResponse.json(transformedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
