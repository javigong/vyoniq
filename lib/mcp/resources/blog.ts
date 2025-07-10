import { MCPResource } from "../types";
import prisma from "../../../lib/prisma";

interface BlogPostWithIncludes {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: Date;
  readTime: number;
  featured: boolean;
  tintColor: string | null;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface BlogCategoryWithCount {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: {
    blogPosts: number;
  };
}

interface BlogAuthorWithCount {
  id: string;
  name: string;
  avatar: string | null;
  title: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    blogPosts: number;
  };
}

export async function resolveBlogPostsResource(): Promise<MCPResource> {
  try {
    const posts = (await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
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

    const resourceData = {
      total: posts.length,
      posts: posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        publishDate: post.publishDate.toISOString(),
        readTime: post.readTime,
        featured: post.featured,
        tintColor: post.tintColor,
        author: {
          id: post.author.id,
          name: post.author.name,
          avatar: post.author.avatar,
        },
        categories: post.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
          slug: pc.category.slug,
        })),
      })),
    };

    return {
      uri: "vyoniq://blog/posts",
      name: "All Blog Posts",
      description: `Complete list of ${posts.length} blog posts with metadata`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    };
  } catch (error) {
    console.error("Error resolving all blog posts resource:", error);
    throw new Error(`Failed to resolve blog posts resource: ${error}`);
  }
}

export async function resolveBlogCategoriesResource(): Promise<MCPResource> {
  try {
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

    const resourceData = {
      total: categories.length,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        postCount: category._count.blogPosts,
        createdAt: category.createdAt.toISOString(),
      })),
    };

    return {
      uri: "vyoniq://blog/categories",
      name: "All Blog Categories",
      description: `Complete list of ${categories.length} blog categories with post counts`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    };
  } catch (error) {
    console.error("Error resolving blog categories resource:", error);
    throw new Error(`Failed to resolve blog categories resource: ${error}`);
  }
}

export async function resolveBlogAuthorsResource(): Promise<MCPResource> {
  try {
    const authors = (await prisma.blogAuthor.findMany({
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
    })) as BlogAuthorWithCount[];

    const resourceData = {
      total: authors.length,
      authors: authors.map((author) => ({
        id: author.id,
        name: author.name,
        avatar: author.avatar,
        title: author.title,
        bio: author.bio,
        postCount: author._count.blogPosts,
        createdAt: author.createdAt.toISOString(),
      })),
    };

    return {
      uri: "vyoniq://blog/authors",
      name: "All Blog Authors",
      description: `Complete list of ${authors.length} blog authors with post counts`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    };
  } catch (error) {
    console.error("Error resolving blog authors resource:", error);
    throw new Error(`Failed to resolve blog authors resource: ${error}`);
  }
}

// Resolve individual blog post resource
export async function resolveBlogPostResource(
  postId: string
): Promise<MCPResource | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        author: true,
        categories: {
          include: { category: true },
        },
      },
    });

    if (!post) return null;

    const resourceData = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate,
      readTime: post.readTime,
      featured: post.featured,
      published: post.published,
      tintColor: post.tintColor,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        name: post.author.name,
        bio: post.author.bio,
        avatar: post.author.avatar,
      },
      categories: post.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
      })),
      wordCount: post.content.split(/\s+/).length,
      characterCount: post.content.length,
    };

    return {
      uri: `vyoniq://blog/posts/${postId}`,
      name: `Blog Post: ${post.title}`,
      description: `Full content and metadata for blog post "${post.title}"`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    };
  } catch (error) {
    console.error("Error resolving blog post resource:", error);
    return null;
  }
}

// Resource resolver function
export async function resolveBlogResource(
  uri: string
): Promise<MCPResource | null> {
  const urlParts = uri.replace("vyoniq://blog/", "").split("/");

  switch (urlParts[0]) {
    case "posts":
      if (urlParts.length === 1) {
        return await resolveBlogPostsResource();
      } else if (urlParts.length === 2) {
        return await resolveBlogPostResource(urlParts[1]);
      }
      break;

    case "categories":
      return await resolveBlogCategoriesResource();

    case "authors":
      return await resolveBlogAuthorsResource();
  }

  return null;
}
