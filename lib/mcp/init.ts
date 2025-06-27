import { mcpServer } from "./server";

// Import blog tools
import {
  createBlogPostTool,
  createBlogPostHandler,
  updateBlogPostTool,
  updateBlogPostHandler,
  publishBlogPostTool,
  publishBlogPostHandler,
  deleteBlogPostTool,
  deleteBlogPostHandler,
  createCategoryTool,
  createCategoryHandler,
  listBlogPostsTool,
  listBlogPostsHandler,
  listCategoriesTool,
  listCategoriesHandler,
  getBlogPostTool,
  getBlogPostHandler,
} from "./tools/blog";

// Import blog resources
import { createBlogPostResources, resolveBlogResource } from "./resources/blog";

// Initialize the MCP server with all tools and resources
export function initializeMCPServer() {
  console.log("Initializing Vyoniq MCP Server...");

  // Register blog management tools
  mcpServer.addTool(createBlogPostTool, createBlogPostHandler);
  mcpServer.addTool(updateBlogPostTool, updateBlogPostHandler);
  mcpServer.addTool(publishBlogPostTool, publishBlogPostHandler);
  mcpServer.addTool(deleteBlogPostTool, deleteBlogPostHandler);
  mcpServer.addTool(createCategoryTool, createCategoryHandler);
  mcpServer.addTool(listBlogPostsTool, listBlogPostsHandler);
  mcpServer.addTool(listCategoriesTool, listCategoriesHandler);
  mcpServer.addTool(getBlogPostTool, getBlogPostHandler);

  // Register blog resource templates
  const blogResourceTemplates = createBlogPostResources();
  blogResourceTemplates.forEach((template) => {
    mcpServer.addResourceTemplate(template);
  });

  // Note: Dynamic resource resolution is now handled directly in the server's handleResourceRead method

  // Add analytics resource
  mcpServer.addResource({
    uri: "vyoniq://analytics/dashboard",
    name: "Admin Analytics Dashboard",
    description: "Overview of blog, user, and newsletter analytics",
    mimeType: "application/json",
    text: JSON.stringify(
      {
        message: "Analytics data would be generated here",
        endpoints: [
          "GET /api/admin/analytics/blog",
          "GET /api/admin/analytics/users",
          "GET /api/admin/analytics/newsletters",
        ],
      },
      null,
      2
    ),
  });

  // Add capabilities resource
  mcpServer.addResource({
    uri: "vyoniq://capabilities",
    name: "MCP Server Capabilities",
    description: "Complete list of available MCP server capabilities and tools",
    mimeType: "application/json",
    text: JSON.stringify(
      {
        tools: [
          {
            name: "create_blog_post",
            description: "Create a new blog post with content and metadata",
            category: "Blog Management",
          },
          {
            name: "update_blog_post",
            description: "Update existing blog post content and metadata",
            category: "Blog Management",
          },
          {
            name: "publish_blog_post",
            description: "Publish or unpublish a blog post",
            category: "Blog Management",
          },
          {
            name: "delete_blog_post",
            description: "Permanently delete a blog post",
            category: "Blog Management",
          },
          {
            name: "create_category",
            description: "Create a new blog category",
            category: "Blog Management",
          },
          {
            name: "list_blog_posts",
            description: "List all blog posts with optional filtering",
            category: "Blog Management",
          },
          {
            name: "list_categories",
            description: "List all blog categories with post counts",
            category: "Blog Management",
          },
          {
            name: "get_blog_post",
            description:
              "Get the full content and details of a specific blog post",
            category: "Blog Management",
          },
        ],
        resources: [
          {
            uri: "vyoniq://blog/posts",
            description: "All blog posts with metadata",
          },
          {
            uri: "vyoniq://blog/posts/{postId}",
            description: "Individual blog post with full content",
          },
          {
            uri: "vyoniq://blog/categories",
            description: "All blog categories",
          },
          {
            uri: "vyoniq://blog/authors",
            description: "All blog authors",
          },
          {
            uri: "vyoniq://server/info",
            description: "Server information and capabilities",
          },
          {
            uri: "vyoniq://analytics/dashboard",
            description: "Admin analytics overview",
          },
        ],
        authentication: {
          methods: ["clerk", "bearer_token"],
          required: true,
          adminOnly: true,
        },
      },
      null,
      2
    ),
  });

  console.log("✅ Vyoniq MCP Server initialized successfully");
  console.log(`📊 Registered ${mcpServer.listTools().length} tools`);
  console.log(
    `📁 Registered ${mcpServer.listResources().length} static resources`
  );
  console.log(
    `📋 Registered ${
      mcpServer.listResourceTemplates().length
    } resource templates`
  );
}

// Call initialization
initializeMCPServer();
