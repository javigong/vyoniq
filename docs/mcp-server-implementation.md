# MCP Server Implementation Guide

This document provides comprehensive guidelines for implementing Model Context Protocol (MCP) servers that work seamlessly with Cursor IDE and other MCP clients. This guide is based on lessons learned from building and debugging the Vyoniq MCP server.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Schema Design](#schema-design)
4. [Authentication](#authentication)
5. [Tool Implementation](#tool-implementation)
6. [JSON-RPC Protocol](#json-rpc-protocol)
7. [Testing and Debugging](#testing-and-debugging)
8. [Common Pitfalls](#common-pitfalls)
9. [Best Practices](#best-practices)

## Overview

The Model Context Protocol (MCP) enables secure connections between host applications (like Cursor) and data sources. A properly implemented MCP server must:

- Follow JSON-RPC 2.0 protocol specification
- Provide proper JSON Schema for tool parameters
- Handle authentication securely
- Return structured responses
- Support protocol negotiation

## Project Structure

### Recommended Directory Layout

```
lib/mcp/
├── server.ts          # Main MCP server implementation
├── init.ts           # Server initialization
├── types.ts          # Type definitions and schemas
├── tools/            # Tool implementations
│   ├── blog.ts
│   └── analytics.ts
└── resources/        # Resource handlers
    └── blog.ts
```

### Key Files

- **`server.ts`**: Core MCP server with JSON-RPC handling
- **`types.ts`**: Zod schemas and TypeScript interfaces
- **`tools/`**: Individual tool implementations
- **`resources/`**: Resource providers for dynamic content

## Schema Design

### Critical Requirements for Cursor Compatibility

**❌ Common Mistake**: Using raw Zod schemas without descriptions

```typescript
// This won't show parameter descriptions in Cursor
const BadSchema = z.object({
  title: z.string().min(1),
  published: z.boolean().optional(),
});
```

**✅ Correct Implementation**: Always use `.describe()` for every parameter

```typescript
// This will show proper descriptions in Cursor
const GoodSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .describe("The title of the blog post"),
  published: z
    .boolean()
    .optional()
    .describe(
      "Filter posts by published status (true for published, false for drafts, omit for all posts)"
    ),
});
```

### Schema Conversion for MCP

Use `zod-to-json-schema` with proper configuration:

```typescript
import { zodToJsonSchema } from "zod-to-json-schema";

// Install: pnpm add zod-to-json-schema

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: any; // JSON Schema for MCP clients
  zodSchema?: z.ZodSchema; // Zod schema for server validation
}

const createBlogPostTool: MCPTool = {
  name: "create_blog_post",
  description:
    "Create a new blog post with specified content, categories, and metadata",
  // Convert to JSON Schema for MCP clients (like Cursor)
  inputSchema: zodToJsonSchema(CreateBlogPostSchema, {
    $refStrategy: "none", // Use inline schemas, not $ref
  }),
  // Keep Zod schema for server-side validation
  zodSchema: CreateBlogPostSchema,
};
```

### Schema Best Practices

1. **Always include descriptions**: Every parameter must have a `.describe()` call
2. **Use inline schemas**: Set `$refStrategy: "none"` to avoid $ref complexity
3. **Provide meaningful descriptions**: Be specific about parameter purpose and format
4. **Include validation rules**: Use `.min()`, `.max()`, `.optional()`, etc.
5. **Document array types**: Clearly explain array item types and purposes

```typescript
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
```

## Authentication

### Dual Authentication Strategy

Implement both API key and session-based authentication:

```typescript
export async function authenticateRequest(
  request: NextRequest
): Promise<MCPAuthContext | null> {
  // 1. Check for API key first (for external MCP clients)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return await authenticateApiKey(authHeader.replace("Bearer ", ""));
  }

  // 2. Fall back to Clerk session (for web UI)
  return await authenticateClerkSession(request);
}
```

### API Key Format and Storage

```typescript
// API Key Format: vyoniq_sk_<64_hex_characters>
const API_KEY_PREFIX = "vyoniq_sk_";
const API_KEY_LENGTH = 64; // hex characters after prefix

// Store hashed keys in database
const hashedKey = await bcrypt.hash(rawKey, 12);

// Validate keys
const isValid = await bcrypt.compare(providedKey, storedHashedKey);
```

## Tool Implementation

### Tool Registration Pattern

```typescript
// tools/blog.ts
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
    // 1. Validate permissions
    if (!auth.isAdmin) {
      return createErrorResponse("Unauthorized: Admin access required");
    }

    // 2. Validate and parse arguments using Zod schema
    const data = CreateBlogPostSchema.parse(args);

    // 3. Perform business logic
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        // ... other fields
        authorId: auth.userId,
      },
    });

    // 4. Return structured success response
    return createSuccessResponse(
      `Successfully created blog post: "${post.title}" (ID: ${post.id})`
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
```

### Response Helpers

```typescript
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
```

## JSON-RPC Protocol

### Protocol Version Support

```typescript
// Always support the latest MCP protocol version
const SUPPORTED_PROTOCOL_VERSION = "2024-11-05";

// Handle initialize method
case "initialize":
  return NextResponse.json({
    jsonrpc: "2.0",
    id: body.id,
    result: {
      protocolVersion: SUPPORTED_PROTOCOL_VERSION,
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: "vyoniq-mcp-server",
        version: "1.0.0",
      },
    },
  });
```

### Method Handlers

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate JSON-RPC format
    if (body.jsonrpc !== "2.0") {
      return createErrorResponse(
        MCP_ERRORS.INVALID_REQUEST,
        "Invalid JSON-RPC version"
      );
    }

    // Route to appropriate handler
    switch (body.method) {
      case "initialize":
        return handleInitialize(body);
      case "tools/list":
        return await handleToolsList(body, request);
      case "tools/call":
        return await handleToolsCall(body, request);
      case "resources/list":
        return await handleResourcesList(body, request);
      case "resources/read":
        return await handleResourcesRead(body, request);
      default:
        return createErrorResponse(
          MCP_ERRORS.METHOD_NOT_FOUND,
          `Method not found: ${body.method}`
        );
    }
  } catch (error) {
    console.error("MCP Server Error:", error);
    return createErrorResponse(
      MCP_ERRORS.INTERNAL_ERROR,
      "Internal server error"
    );
  }
}
```

## Testing and Debugging

### Test Script Template

Create comprehensive test scripts to validate your MCP server:

```typescript
// test-mcp-server.ts
async function testMCPServer() {
  const baseUrl = "http://localhost:3000/api/mcp";
  const apiKey = "your_api_key_here";

  // Test 1: Initialize
  const initResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    }),
  });

  // Test 2: List tools
  const toolsResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
    }),
  });

  // Test 3: Call tool
  const callResponse = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "list_blog_posts",
        arguments: { published: true },
      },
    }),
  });

  // Validate responses
  console.log("Initialize:", await initResponse.json());
  console.log("Tools:", await toolsResponse.json());
  console.log("Call:", await callResponse.json());
}
```

### Schema Validation Test

```typescript
// Test parameter descriptions
async function testSchemaDescriptions() {
  const response = await fetch("http://localhost:3000/api/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer your_api_key",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list",
    }),
  });

  const data = await response.json();

  data.result.tools.forEach((tool: any) => {
    console.log(`Tool: ${tool.name}`);
    const properties = tool.inputSchema?.properties || {};
    Object.keys(properties).forEach((key) => {
      const prop = properties[key];
      const hasDescription =
        prop.description && prop.description.trim().length > 0;
      console.log(
        `  ${hasDescription ? "✅" : "❌"} ${key}: ${
          prop.description || "NO DESCRIPTION"
        }`
      );
    });
  });
}
```

## Common Pitfalls

### 1. Missing Parameter Descriptions

**Problem**: Cursor shows tools but no parameter descriptions
**Solution**: Always use `.describe()` on every Zod schema field

### 2. $ref-based JSON Schema

**Problem**: Complex schema references confuse MCP clients
**Solution**: Use `{ $refStrategy: "none" }` in `zodToJsonSchema()`

### 3. Authentication Issues

**Problem**: API key validation fails with bcrypt hashed keys
**Solution**: Use `bcrypt.compare()` instead of direct string comparison

### 4. Invalid JSON-RPC Responses

**Problem**: Missing `jsonrpc: "2.0"` or incorrect error codes
**Solution**: Always include proper JSON-RPC envelope

### 5. Tool Registration Errors

**Problem**: Tools not appearing in client
**Solution**: Ensure tools are properly registered in server initialization

## Best Practices

### 1. Schema Design

- Always include parameter descriptions
- Use meaningful validation rules
- Provide sensible defaults
- Document complex types thoroughly

### 2. Error Handling

- Use structured error responses
- Include helpful error messages
- Log errors for debugging
- Return appropriate HTTP status codes

### 3. Authentication

- Support multiple auth methods
- Use secure key storage (bcrypt)
- Implement proper permission checks
- Provide clear auth error messages

### 4. Testing

- Create comprehensive test suites
- Test with actual MCP clients
- Validate schema generation
- Test error scenarios

### 5. Documentation

- Document all tools and parameters
- Provide usage examples
- Maintain API compatibility
- Version your protocol support

## Deployment Checklist

Before deploying an MCP server:

- [ ] All tools have parameter descriptions
- [ ] Schema conversion works correctly (`$refStrategy: "none"`)
- [ ] Authentication is properly implemented
- [ ] JSON-RPC protocol is correctly handled
- [ ] Error responses are structured properly
- [ ] Test suite passes completely
- [ ] API keys are securely generated and stored
- [ ] Protocol version is current
- [ ] All tools are registered in server initialization
- [ ] Response format matches MCP specification

## Troubleshooting

### Cursor Shows "0 tools enabled"

1. Check if tools are properly registered
2. Verify JSON Schema format (use inline schemas)
3. Ensure authentication is working
4. Check server logs for errors

### Parameter descriptions not showing

1. Add `.describe()` to all Zod schema fields
2. Verify `zodToJsonSchema` configuration
3. Test schema output with test script

### Authentication failures

1. Check API key format and hashing
2. Verify bcrypt comparison logic
3. Test with known valid keys
4. Check permission levels

### JSON-RPC errors

1. Ensure `jsonrpc: "2.0"` in all responses
2. Use correct error codes from MCP specification
3. Include proper request/response IDs
4. Validate request format before processing

---

This guide should be updated as the MCP specification evolves and new best practices are discovered.
