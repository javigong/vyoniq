import prisma from "@/lib/prisma";
import { MCPResource, MCPResourceTemplate } from "../types";

// Blog Post Resources
export function createBlogPostResources(): MCPResourceTemplate[] {
  return [
    {
      uriTemplate: "vyoniq://blog/posts/{postId}",
      name: "Blog Post",
      description: "Individual blog post with full content and metadata",
      mimeType: "application/json",
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    },
    {
      uriTemplate: "vyoniq://blog/posts",
      name: "All Blog Posts",
      description: "List of all blog posts with metadata",
      mimeType: "application/json",
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    },
    {
      uriTemplate: "vyoniq://blog/categories",
      name: "Blog Categories",
      description: "List of all blog categories",
      mimeType: "application/json",
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    },
    {
      uriTemplate: "vyoniq://blog/authors",
      name: "Blog Authors",
      description: "List of all blog authors",
      mimeType: "application/json",
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    },
  ];
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

// Resolve all blog posts resource
export async function resolveAllBlogPostsResource(): Promise<MCPResource> {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
        categories: {
          include: { category: true },
        },
      },
      orderBy: { publishDate: "desc" },
    });

    const resourceData = {
      total: posts.length,
      published: posts.filter((p) => p.published).length,
      drafts: posts.filter((p) => !p.published).length,
      featured: posts.filter((p) => p.featured).length,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
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
        },
        categories: post.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
        })),
        wordCount: post.content.split(/\s+/).length,
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
    return {
      uri: "vyoniq://blog/posts",
      name: "All Blog Posts",
      description: "Error loading blog posts",
      mimeType: "application/json",
      text: JSON.stringify({ error: "Failed to load blog posts" }, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 1,
      },
    };
  }
}

// Resolve blog categories resource
export async function resolveBlogCategoriesResource(): Promise<MCPResource> {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const resourceData = {
      total: categories.length,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        postCount: category._count.posts,
        createdAt: category.createdAt,
      })),
    };

    return {
      uri: "vyoniq://blog/categories",
      name: "Blog Categories",
      description: `List of ${categories.length} blog categories with post counts`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    };
  } catch (error) {
    console.error("Error resolving blog categories resource:", error);
    return {
      uri: "vyoniq://blog/categories",
      name: "Blog Categories",
      description: "Error loading categories",
      mimeType: "application/json",
      text: JSON.stringify({ error: "Failed to load categories" }, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    };
  }
}

// Resolve blog authors resource
export async function resolveBlogAuthorsResource(): Promise<MCPResource> {
  try {
    const authors = await prisma.blogAuthor.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const resourceData = {
      total: authors.length,
      authors: authors.map((author) => ({
        id: author.id,
        name: author.name,
        bio: author.bio,
        avatar: author.avatar,
        postCount: author._count.posts,
        createdAt: author.createdAt,
      })),
    };

    return {
      uri: "vyoniq://blog/authors",
      name: "Blog Authors",
      description: `List of ${authors.length} blog authors with post counts`,
      mimeType: "application/json",
      text: JSON.stringify(resourceData, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    };
  } catch (error) {
    console.error("Error resolving blog authors resource:", error);
    return {
      uri: "vyoniq://blog/authors",
      name: "Blog Authors",
      description: "Error loading authors",
      mimeType: "application/json",
      text: JSON.stringify({ error: "Failed to load authors" }, null, 2),
      annotations: {
        audience: ["admin", "ai"],
        priority: 2,
      },
    };
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
        return await resolveAllBlogPostsResource();
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
