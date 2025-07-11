import { z } from "zod";

// MCP Protocol Types
export interface MCPRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: unknown;
}

export interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

// Resource Types
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  text?: string;
  blob?: string;
  annotations?: {
    audience?: string[];
    priority?: number;
  };
}

export interface MCPResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
  annotations?: {
    audience?: string[];
    priority?: number;
  };
}

// Tool Types
export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: any; // JSON Schema object for MCP clients
  zodSchema?: z.ZodSchema; // Zod schema for server-side validation
}

export interface MCPToolCall {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface MCPToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Blog Post Types for MCP
export const CreateBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .describe("The title of the blog post"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .describe("A brief summary or excerpt of the blog post"),
  content: z
    .string()
    .min(1, "Content is required")
    .describe("The full content/body of the blog post in markdown format"),
  coverImage: z
    .string()
    .optional()
    .default("/llms.jpeg")
    .describe("URL or path to the cover image for the blog post"),
  publishDate: z
    .string()
    .optional()
    .describe(
      "Publication date in ISO string format (optional, defaults to current date)"
    ),
  readTime: z
    .number()
    .int()
    .positive()
    .optional()
    .default(5)
    .describe("Estimated reading time in minutes"),
  featured: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether this post should be featured on the homepage"),
  published: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether the post is published (true) or draft (false)"),
  tintColor: z
    .string()
    .optional()
    .describe("Optional hex color code for post theming"),
  categoryIds: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Array of category IDs to associate with this post"),
});

export const UpdateBlogPostSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .describe("The unique ID of the blog post to update"),
  title: z.string().optional().describe("The title of the blog post"),
  excerpt: z
    .string()
    .optional()
    .describe("A brief summary or excerpt of the blog post"),
  content: z
    .string()
    .optional()
    .describe("The full content/body of the blog post in markdown format"),
  coverImage: z
    .string()
    .optional()
    .describe("URL or path to the cover image for the blog post"),
  publishDate: z
    .string()
    .optional()
    .describe("Publication date in ISO string format"),
  readTime: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Estimated reading time in minutes"),
  featured: z
    .boolean()
    .optional()
    .describe("Whether this post should be featured on the homepage"),
  published: z
    .boolean()
    .optional()
    .describe("Whether the post is published (true) or draft (false)"),
  tintColor: z
    .string()
    .optional()
    .describe("Optional hex color code for post theming"),
  categoryIds: z
    .array(z.string())
    .optional()
    .describe("Array of category IDs to associate with this post"),
});

export const PublishBlogPostSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .describe("The unique ID of the blog post to publish or unpublish"),
  published: z
    .boolean()
    .default(true)
    .describe("Whether to publish (true) or unpublish (false) the post"),
});

export const DeleteBlogPostSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .describe("The unique ID of the blog post to delete permanently"),
});

// Newsletter Types for MCP
export const CreateNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  previewText: z.string().optional(),
  isDraft: z.boolean().optional().default(true),
});

export const SendNewsletterSchema = z.object({
  id: z.string().min(1, "Newsletter ID is required"),
  sendTime: z.enum(["immediate", "scheduled"]).default("immediate"),
  scheduleDate: z.string().optional(),
});

// Category Types for MCP
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .describe("The name of the new blog category to create"),
});

export const UpdateCategorySchema = z.object({
  id: z
    .string()
    .min(1, "Category ID is required")
    .describe("The unique ID of the category to update"),
  name: z
    .string()
    .min(1, "Category name is required")
    .describe("The new name for the category"),
});

export const DeleteCategorySchema = z.object({
  id: z
    .string()
    .min(1, "Category ID is required")
    .describe("The unique ID of the category to delete"),
  movePostsToCategory: z
    .string()
    .optional()
    .describe("Category ID to move posts to (creates 'Uncategorized' if not specified)"),
});

export const SuggestCategoriesSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .describe("The blog post content to analyze for category suggestions"),
  title: z
    .string()
    .min(1, "Title is required")
    .describe("The blog post title to analyze for category suggestions"),
  existingCategoryIds: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Already selected category IDs to exclude from suggestions"),
});

export const BulkUpdatePostsSchema = z.object({
  postIds: z
    .array(z.string())
    .min(1, "At least one post ID is required")
    .describe("Array of blog post IDs to update"),
  updates: z.object({
    published: z.boolean().optional().describe("Publish or unpublish all posts"),
    featured: z.boolean().optional().describe("Mark all posts as featured or not"),
    categoryIds: z.array(z.string()).optional().describe("Apply these categories to all posts"),
    addCategoryIds: z.array(z.string()).optional().describe("Add these categories to all posts"),
    removeCategoryIds: z.array(z.string()).optional().describe("Remove these categories from all posts"),
    tintColor: z.string().optional().describe("Apply this tint color to all posts"),
  }).describe("Updates to apply to all selected posts"),
});

export const ListBlogPostsSchema = z.object({
  published: z
    .boolean()
    .optional()
    .describe(
      "Filter posts by published status (true for published, false for drafts, omit for all posts)"
    ),
});

export const ListCategoriesSchema = z.object({
  // No parameters needed for listing categories
});

export const GetBlogPostSchema = z.object({
  id: z
    .string()
    .min(1, "Post ID is required")
    .describe("The unique ID of the blog post to retrieve"),
});

// Analytics Types for MCP
export const GetAnalyticsSchema = z.object({
  type: z.enum(["blog", "users", "newsletters"]),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Authentication Types
export interface MCPAuthContext {
  userId: string;
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
  };
  apiKeyId?: string; // Present when authenticated via API key
  scopes?: string[]; // API key permissions
}

// Error Codes
export const MCP_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32002,
  NOT_FOUND: -32003,
  VALIDATION_ERROR: -32004,
} as const;

export type MCPErrorCode = (typeof MCP_ERRORS)[keyof typeof MCP_ERRORS];
