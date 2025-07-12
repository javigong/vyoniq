import prisma from "@/lib/prisma";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
  PublishBlogPostSchema,
  DeleteBlogPostSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  DeleteCategorySchema,
  SuggestCategoriesSchema,
  BulkUpdatePostsSchema,
  ListBlogPostsSchema,
  ListCategoriesSchema,
  GetBlogPostSchema,
  RevalidateBlogSchema,
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

    // Enhanced: Check for similar categories to avoid duplicates
    const similarCategories = await prisma.blogCategory.findMany({
      where: {
        OR: [
          { name: { contains: data.name } },
          { slug: { contains: data.name.toLowerCase().replace(/\s+/g, "-") } },
        ],
      },
    });

    if (similarCategories.length > 0) {
      return createErrorResponse(
        `Similar categories found: ${similarCategories
          .map((c) => c.name)
          .join(
            ", "
          )}. Consider using existing categories or choose a more specific name.`
      );
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

// Update Category Tool
export const updateCategoryTool: MCPTool = {
  name: "update_category",
  description: "Update an existing blog category name or slug",
  inputSchema: zodToJsonSchema(UpdateCategorySchema, { $refStrategy: "none" }),
  zodSchema: UpdateCategorySchema,
};

export async function updateCategoryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = UpdateCategorySchema.parse(args);

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id: data.id },
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    });

    if (!existingCategory) {
      return createErrorResponse(`Category with ID '${data.id}' not found`);
    }

    // Check if new name conflicts with existing categories
    const conflictingCategory = await prisma.blogCategory.findFirst({
      where: {
        name: data.name,
        id: { not: data.id },
      },
    });

    if (conflictingCategory) {
      return createErrorResponse(`Category '${data.name}' already exists`);
    }

    // Update the category
    const updatedCategory = await prisma.blogCategory.update({
      where: { id: data.id },
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
      `Successfully updated category: "${updatedCategory.name}" (ID: ${updatedCategory.id})\n` +
        `Associated with ${existingCategory._count.blogPosts} blog posts`
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return createErrorResponse(
      `Failed to update category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete Category Tool
export const deleteCategoryTool: MCPTool = {
  name: "delete_category",
  description:
    "Delete a blog category and optionally move posts to another category",
  inputSchema: zodToJsonSchema(DeleteCategorySchema, { $refStrategy: "none" }),
  zodSchema: DeleteCategorySchema,
};

export async function deleteCategoryHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = DeleteCategorySchema.parse(args);

    // Check if category exists
    const categoryToDelete = await prisma.blogCategory.findUnique({
      where: { id: data.id },
      include: {
        _count: {
          select: { blogPosts: true },
        },
      },
    });

    if (!categoryToDelete) {
      return createErrorResponse(`Category with ID '${data.id}' not found`);
    }

    let targetCategoryId = data.movePostsToCategory;

    // If posts exist and no target category specified, create "Uncategorized"
    if (categoryToDelete._count.blogPosts > 0 && !targetCategoryId) {
      let uncategorizedCategory = await prisma.blogCategory.findFirst({
        where: { name: "Uncategorized" },
      });

      if (!uncategorizedCategory) {
        uncategorizedCategory = await prisma.blogCategory.create({
          data: {
            name: "Uncategorized",
            slug: "uncategorized",
          },
        });
      }

      targetCategoryId = uncategorizedCategory.id;
    }

    // Move posts to target category if specified
    if (targetCategoryId && categoryToDelete._count.blogPosts > 0) {
      await prisma.blogPostCategory.updateMany({
        where: { categoryId: data.id },
        data: { categoryId: targetCategoryId },
      });
    }

    // Delete the category
    await prisma.blogCategory.delete({
      where: { id: data.id },
    });

    return createSuccessResponse(
      `Successfully deleted category: "${categoryToDelete.name}"\n` +
        `${categoryToDelete._count.blogPosts} posts ${
          targetCategoryId ? `moved to target category` : "were unassigned"
        }`
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return createErrorResponse(
      `Failed to delete category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Suggest Categories Tool
export const suggestCategoriesTool: MCPTool = {
  name: "suggest_categories_for_post",
  description:
    "Analyze post content and suggest relevant categories based on existing categories",
  inputSchema: zodToJsonSchema(SuggestCategoriesSchema, {
    $refStrategy: "none",
  }),
  zodSchema: SuggestCategoriesSchema,
};

export async function suggestCategoriesHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = SuggestCategoriesSchema.parse(args);

    // Get all existing categories
    const allCategories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Filter out already selected categories
    const availableCategories = allCategories.filter(
      (cat) => !data.existingCategoryIds.includes(cat.id)
    );

    // Simple keyword-based suggestion algorithm
    const contentText = `${data.title} ${data.content}`.toLowerCase();
    const suggestions = [];

    for (const category of availableCategories) {
      const categoryKeywords = category.name.toLowerCase().split(/[\s-&]+/);
      const categorySlugKeywords = category.slug.split("-");

      let score = 0;

      // Check for exact keyword matches
      for (const keyword of [...categoryKeywords, ...categorySlugKeywords]) {
        if (keyword.length > 2) {
          // Ignore very short words
          const keywordRegex = new RegExp(`\\b${keyword}\\b`, "gi");
          const matches = contentText.match(keywordRegex);
          if (matches) {
            score += matches.length;
          }
        }
      }

      // Boost score for title matches
      const titleText = data.title.toLowerCase();
      for (const keyword of categoryKeywords) {
        if (keyword.length > 2 && titleText.includes(keyword)) {
          score += 3; // Higher weight for title matches
        }
      }

      if (score > 0) {
        suggestions.push({
          category,
          score,
          reason: `Found ${score} relevant keyword matches`,
        });
      }
    }

    // Sort by score and take top 5
    suggestions.sort((a, b) => b.score - a.score);
    const topSuggestions = suggestions.slice(0, 5);

    if (topSuggestions.length === 0) {
      return createSuccessResponse(
        "No category suggestions found based on content analysis.\n" +
          "Consider creating new categories or manually selecting from existing ones."
      );
    }

    const suggestionText = topSuggestions
      .map(
        (s, index) =>
          `${index + 1}. ${s.category.name} (ID: ${s.category.id}) - ${
            s.reason
          }`
      )
      .join("\n");

    return createSuccessResponse(
      `Found ${topSuggestions.length} category suggestions:\n\n${suggestionText}\n\n` +
        `Available categories: ${availableCategories.length}\n` +
        `Already selected: ${data.existingCategoryIds.length}`
    );
  } catch (error) {
    console.error("Error suggesting categories:", error);
    return createErrorResponse(
      `Failed to suggest categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Bulk Update Posts Tool
export const bulkUpdatePostsTool: MCPTool = {
  name: "bulk_update_posts",
  description: "Update multiple blog posts at once with various operations",
  inputSchema: zodToJsonSchema(BulkUpdatePostsSchema, { $refStrategy: "none" }),
  zodSchema: BulkUpdatePostsSchema,
};

export async function bulkUpdatePostsHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = BulkUpdatePostsSchema.parse(args);

    // Verify all posts exist
    const existingPosts = await prisma.blogPost.findMany({
      where: {
        id: { in: data.postIds },
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (existingPosts.length !== data.postIds.length) {
      const foundIds = existingPosts.map((p) => p.id);
      const missingIds = data.postIds.filter((id) => !foundIds.includes(id));
      return createErrorResponse(
        `Some posts not found: ${missingIds.join(", ")}`
      );
    }

    const results = [];

    // Update basic fields
    if (
      data.updates.published !== undefined ||
      data.updates.featured !== undefined ||
      data.updates.tintColor !== undefined
    ) {
      const updateData: any = {};
      if (data.updates.published !== undefined)
        updateData.published = data.updates.published;
      if (data.updates.featured !== undefined)
        updateData.featured = data.updates.featured;
      if (data.updates.tintColor !== undefined)
        updateData.tintColor = data.updates.tintColor;

      const updateResult = await prisma.blogPost.updateMany({
        where: {
          id: { in: data.postIds },
        },
        data: updateData,
      });

      results.push(`Updated ${updateResult.count} posts with basic fields`);
    }

    // Handle category operations
    if (data.updates.categoryIds) {
      // Replace all categories
      await prisma.blogPostCategory.deleteMany({
        where: { blogPostId: { in: data.postIds } },
      });

      if (data.updates.categoryIds.length > 0) {
        const categoryAssignments = data.postIds.flatMap((postId) =>
          data.updates.categoryIds!.map((categoryId) => ({
            blogPostId: postId,
            categoryId,
          }))
        );

        await prisma.blogPostCategory.createMany({
          data: categoryAssignments,
        });
      }

      results.push(`Replaced categories for ${data.postIds.length} posts`);
    }

    if (data.updates.addCategoryIds && data.updates.addCategoryIds.length > 0) {
      // Add categories (avoid duplicates)
      const newAssignments = [];

      for (const postId of data.postIds) {
        for (const categoryId of data.updates.addCategoryIds) {
          const existing = await prisma.blogPostCategory.findUnique({
            where: {
              blogPostId_categoryId: {
                blogPostId: postId,
                categoryId,
              },
            },
          });

          if (!existing) {
            newAssignments.push({ blogPostId: postId, categoryId });
          }
        }
      }

      if (newAssignments.length > 0) {
        await prisma.blogPostCategory.createMany({
          data: newAssignments,
        });
      }

      results.push(`Added ${newAssignments.length} new category assignments`);
    }

    if (
      data.updates.removeCategoryIds &&
      data.updates.removeCategoryIds.length > 0
    ) {
      // Remove categories
      const deleteResult = await prisma.blogPostCategory.deleteMany({
        where: {
          blogPostId: { in: data.postIds },
          categoryId: { in: data.updates.removeCategoryIds },
        },
      });

      results.push(`Removed ${deleteResult.count} category assignments`);
    }

    return createSuccessResponse(
      `Bulk update completed for ${
        data.postIds.length
      } posts:\n\n${results.join("\n")}`
    );
  } catch (error) {
    console.error("Error in bulk update:", error);
    return createErrorResponse(
      `Failed to bulk update posts: ${
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
      } - Publish Date: ${post.publishDate.toLocaleDateString()} - Created: ${post.createdAt.toLocaleDateString()} - Author: ${
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

// Revalidate Blog Tool
export const revalidateBlogTool: MCPTool = {
  name: "revalidate_blog",
  description:
    "Revalidate cached blog pages to show latest content immediately",
  inputSchema: zodToJsonSchema(RevalidateBlogSchema, { $refStrategy: "none" }),
  zodSchema: RevalidateBlogSchema,
};

export async function revalidateBlogHandler(
  args: unknown,
  auth: MCPAuthContext
): Promise<MCPToolResult> {
  try {
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    const data = RevalidateBlogSchema.parse(args);

    if (data.action === "revalidate-post" && !data.slug) {
      return createErrorResponse(
        "Slug is required when action is 'revalidate-post'"
      );
    }

    // Make a request to our revalidation API
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/revalidate/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass through the authorization for admin check
        Authorization: `Bearer ${auth.apiKeyId || "internal"}`,
      },
      body: JSON.stringify({
        action: data.action,
        slug: data.slug,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return createErrorResponse(
        `Failed to revalidate: ${error.error || "Unknown error"}`
      );
    }

    const result = await response.json();

    if (data.action === "revalidate-all") {
      return createSuccessResponse(
        `✅ Successfully revalidated all blog pages\n` +
          `Timestamp: ${result.timestamp}\n` +
          `All blog posts and the blog index page have been updated with the latest content.`
      );
    } else {
      return createSuccessResponse(
        `✅ Successfully revalidated blog post: ${data.slug}\n` +
          `Timestamp: ${result.timestamp}\n` +
          `The blog post page and blog index have been updated with the latest content.`
      );
    }
  } catch (error) {
    console.error("Error revalidating blog:", error);
    return createErrorResponse(
      `Failed to revalidate blog: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
