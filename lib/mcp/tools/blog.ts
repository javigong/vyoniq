import prisma from "@/lib/prisma";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  PublishBlogPostSchema,
  DeleteBlogPostSchema,
  CreateCategorySchema,
  ListBlogPostsSchema,
  ListCategoriesSchema,
  GetBlogPostSchema,
  MCPAuthContext,
  MCPToolResult,
  MCPTool,
} from "../types";

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

// Helper functions to create responses (avoiding circular dependency)
function createSuccessResponse(
  content: string,
  isError = false
): MCPToolResult {
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
    isError,
  };
}

function createErrorResponse(message: string): MCPToolResult {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    isError: true,
  };
}

// Create Blog Post Tool
export const createBlogPostTool: MCPTool = {
  name: "create_blog_post",
  description:
    "Create a new blog post with specified content, categories, and metadata",
  inputSchema: zodToJsonSchema(CreateBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: CreateBlogPostSchema,
};

export async function createBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = CreateBlogPostSchema.parse(args);

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return createErrorResponse(
        `A blog post with slug '${slug}' already exists`
      );
    }

    // Get author (for now use the first author, in real app would use auth.userId)
    const author = await prisma.blogAuthor.findFirst();
    if (!author) {
      return createErrorResponse(
        "No blog author found. Please create an author first."
      );
    }

    // Create the blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || "/llms.jpeg",
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
        readTime: data.readTime || 5,
        featured: data.featured || false,
        published: data.published || false,
        tintColor: data.tintColor,
        authorId: author.id,
        categories: {
          create:
            data.categoryIds?.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })) || [],
        },
      },
      include: {
        author: true,
        categories: {
          include: { category: true },
        },
      },
    });

    return createSuccessResponse(
      `Successfully created blog post: "${blogPost.title}" (ID: ${blogPost.id})\n` +
        `Slug: ${blogPost.slug}\n` +
        `Published: ${blogPost.published ? "Yes" : "No (Draft)"}\n` +
        `Featured: ${blogPost.featured ? "Yes" : "No"}\n` +
        `Categories: ${blogPost.categories
          .map((c) => c.category.name)
          .join(", ")}`
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return createErrorResponse(
      `Failed to create blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Update Blog Post Tool
export const updateBlogPostTool: MCPTool = {
  name: "update_blog_post",
  description:
    "Update an existing blog post with new content, metadata, or categories",
  inputSchema: zodToJsonSchema(UpdateBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: UpdateBlogPostSchema,
};

export async function updateBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = UpdateBlogPostSchema.parse(args);

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: data.id },
      include: { categories: true },
    });

    if (!existingPost) {
      return createErrorResponse(`Blog post with ID '${data.id}' not found`);
    }

    // Prepare update data
    const updateData: any = {};

    if (data.title) {
      updateData.title = data.title;
      // Update slug if title changed
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    if (data.excerpt) updateData.excerpt = data.excerpt;
    if (data.content) updateData.content = data.content;
    if (data.coverImage) updateData.coverImage = data.coverImage;
    if (data.publishDate) updateData.publishDate = new Date(data.publishDate);
    if (data.readTime) updateData.readTime = data.readTime;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.published !== undefined) updateData.published = data.published;
    if (data.tintColor) updateData.tintColor = data.tintColor;

    // Handle category updates
    if (data.categoryIds) {
      // Delete existing category associations
      await prisma.blogPostCategory.deleteMany({
        where: { blogPostId: data.id },
      });

      // Create new category associations
      updateData.categories = {
        create: data.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: data.id },
      data: updateData,
      include: {
        author: true,
        categories: {
          include: { category: true },
        },
      },
    });

    return createSuccessResponse(
      `Successfully updated blog post: "${updatedPost.title}"\n` +
        `Slug: ${updatedPost.slug}\n` +
        `Published: ${updatedPost.published ? "Yes" : "No (Draft)"}\n` +
        `Featured: ${updatedPost.featured ? "Yes" : "No"}\n` +
        `Categories: ${updatedPost.categories
          .map((c) => c.category.name)
          .join(", ")}`
    );
  } catch (error) {
    console.error("Error updating blog post:", error);
    return createErrorResponse(
      `Failed to update blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Publish/Unpublish Blog Post Tool
export const publishBlogPostTool: MCPTool = {
  name: "publish_blog_post",
  description: "Publish or unpublish a blog post",
  inputSchema: zodToJsonSchema(PublishBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: PublishBlogPostSchema,
};

export async function publishBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = PublishBlogPostSchema.parse(args);

    const updatedPost = await prisma.blogPost.update({
      where: { id: data.id },
      data: {
        published: data.published,
        publishDate: data.published ? new Date() : undefined,
      },
      include: { author: true },
    });

    const action = data.published ? "published" : "unpublished";
    return createSuccessResponse(
      `Successfully ${action} blog post: "${updatedPost.title}"`
    );
  } catch (error) {
    console.error("Error publishing blog post:", error);
    return createErrorResponse(
      `Failed to publish blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete Blog Post Tool
export const deleteBlogPostTool: MCPTool = {
  name: "delete_blog_post",
  description: "Delete a blog post permanently",
  inputSchema: zodToJsonSchema(DeleteBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: DeleteBlogPostSchema,
};

export async function deleteBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = DeleteBlogPostSchema.parse(args);

    // Get post info before deletion
    const post = await prisma.blogPost.findUnique({
      where: { id: data.id },
    });

    if (!post) {
      return createErrorResponse(`Blog post with ID '${data.id}' not found`);
    }

    // Delete associated categories first
    await prisma.blogPostCategory.deleteMany({
      where: { blogPostId: data.id },
    });

    // Delete the post
    await prisma.blogPost.delete({
      where: { id: data.id },
    });

    return createSuccessResponse(
      `Successfully deleted blog post: "${post.title}"`
    );
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return createErrorResponse(
      `Failed to delete blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Create Category Tool
export const createCategoryTool: MCPTool = {
  name: "create_category",
  description: "Create a new blog category",
  inputSchema: zodToJsonSchema(CreateCategorySchema, { $refStrategy: "none" }),
  zodSchema: CreateCategorySchema,
};

export async function createCategoryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = CreateCategorySchema.parse(args);

    // Check if category already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      return createErrorResponse(`Category '${data.name}' already exists`);
    }

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug: data.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim(),
      },
    });

    return createSuccessResponse(
      `Successfully created category: "${category.name}" (ID: ${category.id})`
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return createErrorResponse(
      `Failed to create category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// List Blog Posts Tool
export const listBlogPostsTool: MCPTool = {
  name: "list_blog_posts",
  description: "List all blog posts with optional filtering",
  inputSchema: zodToJsonSchema(ListBlogPostsSchema, { $refStrategy: "none" }),
  zodSchema: ListBlogPostsSchema,
};

export async function listBlogPostsHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const validatedArgs = ListBlogPostsSchema.parse(args || {});

    const posts = (await prisma.blogPost.findMany({
      where:
        validatedArgs.published !== undefined
          ? { published: validatedArgs.published }
          : {},
      include: {
        author: true,
        categories: {
          include: { category: true },
        },
      },
      orderBy: { publishDate: "desc" },
    })) as BlogPostWithIncludes[];

    const postList = posts
      .map(
        (post) =>
          `${post.id}: "${post.title}" (${
            post.published ? "Published" : "Draft"
          }) - ${post.categories.map((c) => c.category.name).join(", ")}`
      )
      .join("\n");

    return createSuccessResponse(
      `Found ${posts.length} blog posts:\n\n${postList}`
    );
  } catch (error) {
    console.error("Error listing blog posts:", error);
    return createErrorResponse(
      `Failed to list blog posts: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// List Categories Tool
export const listCategoriesTool: MCPTool = {
  name: "list_categories",
  description: "List all blog categories",
  inputSchema: zodToJsonSchema(ListCategoriesSchema, { $refStrategy: "none" }),
  zodSchema: ListCategoriesSchema,
};

export async function listCategoriesHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    });

    const categoryList = categories
      .map(
        (category) =>
          `${category.id}: "${category.name}" (${category._count.blogPosts} posts)`
      )
      .join("\n");

    return createSuccessResponse(
      `Found ${categories.length} categories:\n\n${categoryList}`
    );
  } catch (error) {
    console.error("Error listing categories:", error);
    return createErrorResponse(
      `Failed to list categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Get Blog Post Tool
export const getBlogPostTool: MCPTool = {
  name: "get_blog_post",
  description: "Get the full content and details of a specific blog post",
  inputSchema: zodToJsonSchema(GetBlogPostSchema, { $refStrategy: "none" }),
  zodSchema: GetBlogPostSchema,
};

export async function getBlogPostHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = GetBlogPostSchema.parse(args);

    const post = (await prisma.blogPost.findUnique({
      where: { id: data.id },
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
    })) as BlogPostWithIncludes | null;

    if (!post) {
      return createErrorResponse(`Blog post with ID ${data.id} not found`);
    }

    return createSuccessResponse(
      `Blog post "${post.title}" (ID: ${post.id}) - Status: ${
        post.published ? "Published" : "Draft"
      } - Created: ${post.createdAt.toLocaleDateString()} - Author: ${
        post.author.name
      } - Categories: ${post.categories.map((c) => c.category.name).join(", ")}`
    );
  } catch (error) {
    console.error("Error getting blog post:", error);
    return createErrorResponse(
      `Failed to get blog post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
